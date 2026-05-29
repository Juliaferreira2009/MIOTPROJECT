import mqtt from 'mqtt';

export default class MQTTService {
  constructor() {
    this.client = null;
  }

  connect(config, onMessage, onConnect, onFailure) {
    const {
      host,
      port,
      user,
      pass,
      clientId,
    } = config;

    try {
      const url = `wss://${host}:${port}/mqtt`;

      console.log('Conectando em:', url);

      this.client = mqtt.connect(url, {
        username: user,
        password: pass,
        clientId: clientId,
        reconnectPeriod: 5000,
      });

      this.client.on('connect', () => {
        console.log('MQTT conectado');
        onConnect();
      });

      this.client.on('message', (topic, message) => {
        console.log(
          'Mensagem recebida:',
          topic,
          message.toString()
        );

        onMessage(topic, message.toString());
      });

      this.client.on('error', (error) => {
        console.log('Erro MQTT:', error);

        onFailure(error);
      });

    } catch (error) {
      console.log('Erro geral:', error);

      onFailure(error);
    }
  }

  subscribe(topic) {
    if (this.client) {
      this.client.subscribe(topic);

      console.log('Inscrito:', topic);
    }
  }

  publish(topic, message) {
    if (this.client) {
      this.client.publish(
        topic,
        String(message)
      );

      console.log(
        'Publicado:',
        topic,
        message
      );
    }
  }
}