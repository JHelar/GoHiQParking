/*
	CRUD sql.DB helper.
	Created by John Larsson.
*/

package crud

import (
	"reflect"
	"fmt"
	"strings"
	"log"
	"strconv"
	"database/sql"
	"time"
)

const CRUD_TAG_IGNORE = "ignore"


type member struct {
	Name string
	Value reflect.Value
}

func getDataInfo(table interface{}, includeNil bool) (string, []member) {

	t := reflect.TypeOf(table).Elem()
	v := reflect.ValueOf(table).Elem()

	members := make([]member, 0)
	name := t.Name()

	for i := 0; i < v.NumField(); i++{
		valueField := v.Field(i)
		typeField := t.Field(i)

		if (valueField.Interface() != nil || includeNil) && typeField.Tag.Get("crud") != CRUD_TAG_IGNORE{
			typeField := v.Type().Field(i)
			members = append(members, member{Name:typeField.Name, Value:valueField})
		}
	}
	return name, members
}

func setTableValues(table interface{}, values [][]byte){

	switch table.(type) {
	case reflect.Value:
		v := table.(reflect.Value)

		t := reflect.TypeOf(v.Interface())
		setReflectValues(t, v, values)
	default:

		t := reflect.TypeOf(table).Elem()
		v := reflect.ValueOf(table).Elem()
		setReflectValues(t, v, values)
	}
}

func setReflectValues(t reflect.Type, v reflect.Value, values [][]byte){
	j := 0
	for i := 0; i < t.NumField(); i++{
		tfield := t.Field(i)

		if tfield.Tag.Get("crud") != CRUD_TAG_IGNORE {

			field := v.Field(i)
			val := string(values[j])
			j += 1

			if field.CanSet() {
				switch field.Kind(){
				case reflect.Int:
					x, _ := strconv.Atoi(val)

					field.SetInt(int64(x))
					break
				case reflect.String:
					field.SetString(val)
					break
				case reflect.Bool:
					b, _ := strconv.ParseBool(val)
					field.SetBool(b)
					break
				case reflect.Struct:
					switch field.Interface().(type){
					case time.Time:
						t, err := time.Parse(time.RFC3339Nano, val)
						if err != nil {
							log.Printf("In crud set time: %v", err)
						} else {
							field.Set(reflect.ValueOf(t))
						}

					default:

					}
					break
				case reflect.Ptr:
					if field.Type().String() == "*int" {
						x, _ := strconv.Atoi(val)
						field.Set(reflect.ValueOf(&x))
					}
				default:
					//field.Set(reflect.Zero(reflect.TypeOf(nil)))
					log.Printf("Could not determine value type: %v", field.Kind())
				}
			} else {
				log.Printf("Could not address field: %v into %v", val, field.Kind())
			}
		}
	}
}

func getMemberNames(members []member) []string{
	names := make([]string, 0)
	for _,m := range members{
		names = append(names, m.Name)
	}
	return names
}

func getMemberValues(members []member) []interface{} {
	values := make([]interface{}, 0)
	for _,m := range members{
		values = append(values, m.Value.Interface())
	}
	return values
}

/*
Adds a new row to given database.
Table name is determined by the given interface (struct name) with a 's' appended to the end.
The data is then inserted to the table, returns success state.
*/
func Create(db *sql.DB, data interface{}) bool {
	tableName, members := getDataInfo(data, false)
	tableName += "s"

	names := getMemberNames(members)
	values := getMemberValues(members)

	stmtStr := fmt.Sprintf("INSERT INTO %v(%v) VALUES (?%v)", tableName, strings.Join(names, ","), strings.Repeat(" ,?", len(members) - 1))

	stmt,err := db.Prepare(stmtStr)
	if err != nil {
		log.Print(err)
		return false
	}

	defer stmt.Close()
	_,err = stmt.Exec(values...)

	if err != nil {
		log.Print(err)
		return false
	}
	return true
}
/*
Reads and returns the first row that satisfies the data's first member value.
The data is read and inserted to the given passed by reference, interface.
SelectName and SelectValue is optional, if nil the first datamember in data will be user as selector.
*/
func Read(db *sql.DB, data interface{}, selectName interface{}, selectValue interface{}) bool {
	tableName,members := getDataInfo(data, true)
	tableName += "s"

	values := make([]interface{}, len(members))
	bytes := make([][]byte, len(members))

	for i,_ := range values{
		values[i] = &bytes[i]
	}

	var queryStr string
	var row *sql.Row

	if(selectName == nil || selectValue == nil) {
		queryStr = fmt.Sprintf("SELECT * FROM %v WHERE %v = ?", tableName, members[0].Name)
		row = db.QueryRow(queryStr, members[0].Value.Interface())
	}else{
		queryStr = fmt.Sprintf("SELECT * FROM %v WHERE %v = ?", tableName, selectName)
		row = db.QueryRow(queryStr, selectValue)
	}

	err := row.Scan(values...)
	switch {
	case err == sql.ErrNoRows:
		return false
	case err != nil:
		log.Print("Something went wrong in crud Read")
		return false
	default:
		break
	}
	setTableValues(data, bytes)
	return true
}

func ReadAll(db *sql.DB, dataType interface{}, selectName interface{}, selectValue interface{}) ([]interface{},bool) {

	tableName, members := getDataInfo(dataType, true)
	tableName += "s"

	var queryStr string
	var rows *sql.Rows
	var err error
	if(selectName == nil || selectValue == nil) {
		queryStr = fmt.Sprintf("SELECT * FROM %v", tableName)
		rows, err = db.Query(queryStr, members[0].Value.Interface())
	}else{
		queryStr = fmt.Sprintf("SELECT * FROM %v WHERE %v = ?", tableName, selectName)
		rows, err = db.Query(queryStr, selectValue)
	}
	if err != nil {
		log.Print(err)
		return nil, false
	}
	var datas []interface{}
	for rows.Next(){
		values := make([]interface{}, len(members))
		bytes := make([][]byte, len(members))

		for i,_ := range values{
			values[i] = &bytes[i]
		}
		err := rows.Scan(values...)
		switch {
		case err == sql.ErrNoRows:
			return nil, false
		case err != nil:
			log.Print(err)
			return nil, false
		default:
			t := reflect.New(reflect.TypeOf(dataType).Elem()).Elem()
			setTableValues(t, bytes)
			datas = append(datas, t.Interface())
		}
	}
	return datas, true
}
/*
Updates the first row that satisfies the data's first member.
The row is updated by the data given by the interface.
*/
func Update(db *sql.DB, data interface{}) bool {
	tableName, members := getDataInfo(data, false)
	tableName += "s"

	names := getMemberNames(members)
	values := getMemberValues(members)

	//Append the identifier
	values = append(values, members[0].Value.Interface())

	stmtStr := fmt.Sprintf("UPDATE %v SET %v = ? WHERE %v = ?", tableName, strings.Join(names, " = ?, "), members[0].Name)

	stmt,err := db.Prepare(stmtStr)
	if err != nil {
		log.Print(err)
		return false
	}
	defer stmt.Close()

	_,err = stmt.Exec(values...)
	if err != nil {
		log.Print(err)
		return false
	}
	return true
}
/*
Deletes the first row that satisfies the data's first member value.
*/
func Delete(db *sql.DB, data interface{}) bool {
	tableName, members := getDataInfo(data, false)
	tableName += "s"

	stmtStr := fmt.Sprintf("DELETE FROM %v WHERE %v = ?", tableName, members[0].Name)

	stmt, err := db.Prepare(stmtStr)
	if err != nil {
		log.Print(err)
		return false
	}
	defer stmt.Close()

	_, err = stmt.Exec(members[0].Value.Interface())
	if err != nil {
		log.Print(err)
		return false
	}
	return true
}