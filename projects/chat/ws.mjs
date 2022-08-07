export default class WS {
  constructor(type, ws) {
    this.ws = ws;
    this.events = {};
    this.init(type);

    this.ws.sendMessage = (eventName, data) => {
      this.ws.send(
        JSON.stringify({
          event: eventName,
          payload: data,
        })
      );
    };

    this.ws.subscribe = (eventName, fn) => {
      if (!this.events[eventName]) {
        this.events[eventName] = [];
      }

      this.events[eventName].push(fn);
    };

    this.ws.emmiter = (eventName, data) => {
      const event = this.events[eventName];

      if (event) {
        event.forEach((fn) => {
          fn(data);
        });
      }
    };
  }

  init(type) {
    switch (type) {
      case 'client':
        this.ws.onmessage = ({ data }) => {
          data = JSON.parse(data);

          this.ws.emmiter(data.event, data.payload);
        };
        break;
      case 'server':
        this.ws.on('message', (message) => {
          const data = JSON.parse(message.toString());

          this.ws.emmiter(data.event, data.payload);
        });
        break;
    }
  }
}
