package hiqeventstream
import (
	"fmt"
	"log"
	"net/http"
)

const EVENT_TYPE_UPDATE = "update"
const EVENT_TYPE_PUSH_NOTIFICATION = "notification"
const EVENT_TYPE_MESSAGE = ""

type Message struct {
	ClientOrigin string
	Message []byte
	EventType string
}

type Broker struct {
	Notifier chan Message

	//New Client connections
	newClients chan chan Message

	//Closed client connections
	closingClients chan chan Message

	//Client connections registry
	clients map[chan Message]bool
}

func NewServer()(broker *Broker) {
	broker = &Broker{
		Notifier: make(chan Message, 1),
		newClients: make(chan chan Message),
		closingClients: make(chan chan Message),
		clients: make(map[chan Message]bool),
	}

	//Set the broker running
	go broker.listen()
	return
}

func (broker *Broker) ServeHTTP(rw http.ResponseWriter, req *http.Request){
	//Make sure that the client supports flushing, if not they do not support event stream
	flusher, ok := rw.(http.Flusher)

	if !ok {
		http.Error(rw, "Streaming unsupported!", http.StatusInternalServerError)
		return
	}

	rw.Header().Set("Content-Type", "text/event-stream")
	rw.Header().Set("Cache-Control", "no-cache")
	rw.Header().Set("Connection", "keep-alive")
	rw.Header().Set("Access-Control-Allow-Origin", "*")

	messageChan := make(chan Message)
	clientOrign := req.RemoteAddr

	broker.newClients <- messageChan
	defer func() {
		broker.closingClients <- messageChan
	}()

	notify := rw.(http.CloseNotifier).CloseNotify()

	go func() {
		<- notify
		broker.closingClients <- messageChan
	}()

	for {
		select{
		case msg := <- messageChan:
			//Do not send events to same client.
			log.Printf("Sedning to: %v from client: %v", clientOrign, msg.ClientOrigin)
			if(msg.ClientOrigin != clientOrign){
				fmt.Fprintf(rw, "event:%s\ndata:%s\n\n", msg.EventType, msg.Message)
			}
			flusher.Flush()
		}

	}

}

func (broker *Broker) listen()  {
	for {
		select {
		case s := <- broker.newClients:
			broker.clients[s] = true
			log.Printf("Client added. %d registered clients", len(broker.clients))
		case s := <- broker.closingClients:
			delete(broker.clients, s)
			log.Printf("Removed client. %d registered clients", len(broker.clients))
		case event := <- broker.Notifier:
		//Send new event
			for clientMessageChan, _ := range broker.clients{
				clientMessageChan <- event
			}

		}
	}
}