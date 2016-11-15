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
)

type member struct {
	Name string
	Value reflect.Value
}

func getTableInfo(table interface{}) (string, []member) {

	t := reflect.TypeOf(table).Elem()
	v := reflect.ValueOf(table).Elem()

	members := make([]member, 0)
	tableName := t.Name() + "s"

	for i := 0; i < v.NumField(); i++{
		valueField := v.Field(i)
		typeField := v.Type().Field(i)
		members = append(members, member{Name:typeField.Name, Value:valueField})
	}
	return tableName, members
}

func setTableValues(table interface{}, values [][]byte){
	t := reflect.ValueOf(table).Elem()
	log.Print(t.String())
	setReflectValues(t, values)
}

func setReflectValues(t reflect.Value, values [][]byte){
	for i := 0; i < t.NumField(); i++{

		field := t.Field(i)
		val := string(values[i])
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
			default:
				log.Printf("Could not determine value type: %v", field.Kind())
			}
		}else{
			log.Printf("Could not address field: %v into %v", val, field.Kind())
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
	tableName, members := getTableInfo(data)
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
*/
func Read(db *sql.DB, data interface{}) bool {
	tableName,members := getTableInfo(data)

	values := make([]interface{}, len(members))
	bytes := make([][]byte, len(members))

	for i,_ := range values{
		values[i] = &bytes[i]
	}


	queryStr := fmt.Sprintf("SELECT * FROM %v WHERE %v = ?", tableName, members[0].Name)
	row := db.QueryRow(queryStr, members[0].Value.Interface())

	err := row.Scan(values...)
	if err != nil {
		log.Panic(err)
		return false
	}
	setTableValues(data, bytes)
	return true
}

func ReadAll(db *sql.DB, dataType interface{}) ([]interface{},bool) {

	tableName, members := getTableInfo(dataType)
	queryStr := fmt.Sprintf("SELECT * FROM %v", tableName)

	rows,err := db.Query(queryStr)
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
			log.Print("No rows found!")
			return nil, false
		case err != nil:
			log.Print(err)
			return nil, false
		default:
			t := reflect.New(reflect.TypeOf(dataType).Elem()).Elem()
			setReflectValues(t, bytes)
			datas = append(datas, t)
		}
	}
	return datas, true
}
/*
Updates the first row that satisfies the data's first member.
The row is updated by the data given by the interface.
*/
func Update(db *sql.DB, data interface{}) bool {
	tableName, members := getTableInfo(data)
	names := getMemberNames(members)
	values := getMemberValues(members)

	//Append the identifier
	values = append(values, members[0].Value.Interface())

	stmtStr := fmt.Sprintf("UPDATE %v SET %v = ? WHERE %v = ?", tableName, strings.Join(names, " = ?, "), members[0].Name)

	log.Print(stmtStr)

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
	tableName, members := getTableInfo(data)
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