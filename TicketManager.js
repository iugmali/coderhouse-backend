class TicketManager {
  #basePrice = 0.15;
  events = [];

  getEvents = () => this.events;

  addEvent = (name, place, price, capacity = 50, date = new Date()) => {
    if (name.trim() === "" || place.trim() === "" || price <= 0 || capacity <= 0 || !(date instanceof Date)) {
      console.error("Todos os campos são obrigatórios.");
      return;
    }
    const lastId = this.events[this.events.length - 1]?.id ?? 0;
    const updatedPrice = price + this.#basePrice;
    const event = {
      id: lastId + 1,
      name,
      place,
      price: updatedPrice,
      capacity,
      date,
      participants: []
    }
    this.events.push(event);
  }

  addUser = (eventId, userId) => {
    if (!eventId || !userId) {
      console.error("Todos os campos são obrigatórios.");
      return;
    }
    const event = this.events.find((event) => event.id === eventId);
    if (!event) {
      console.error("Evento não existe.");
      return;
    }
    const eventIndex = this.events.indexOf(event);
    if (event.participants.includes(userId)) {
      console.error("Participante já cadastrado.");
      return;
    }
    event.participants.push(userId);
    this.events[eventIndex] = event;
  }

  putEventoEnGira = (eventId, newCity, newDate) => {
    if (!eventId || newCity.trim() === "" || !(newDate instanceof Date)) {
      console.error("Todos os campos são obrigatórios.");
      return;
    }
    const event = this.events.find((event) => event.id === eventId);
    if (!event) {
      console.error("Evento não existe.");
      return;
    }
    const eventIndex = this.events.indexOf(event);
    this.events[eventIndex] = {...event, place: newCity, date: newDate};
  }
}
