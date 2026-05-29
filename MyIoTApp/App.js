import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import MQTTService from './src/services/mqttService';
import StatusModal from './src/components/StatusModal';
import LightControl from './src/components/LightControl';
import Gauges from './src/components/Gauges';

import {
  saveSensorData,
  getSensorHistory,
} from './src/services/storageService';

const mqtt = new MQTTService();

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [showError, setShowError] = useState(false);

  const [isLighton, setIsLighton] = useState(false);
  const [temp, setTemp] = useState(0);
  const [hum, setHum] = useState(0);

  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const mqttConfig = {
    host: '282f08f441fa41a59e6a75788f0a5209.s1.eu.hivemq.cloud',
    port: 8884,
    user: 'julia',
    pass: 'Ju281927',
    clientId: 'RN_App_' + Math.random(),
  };

  useEffect(() => {
    startConnection();
  }, []);

  const startConnection = () => {
    setShowError(false);

    mqtt.connect(
      mqttConfig,

      async (topic, message) => {
        if (topic === 'casa/temp') {
          setTemp(parseFloat(message));

          await saveSensorData({
            type: 'temperatura',
            value: message,
          });
        }

        if (topic === 'casa/umid') {
          setHum(parseFloat(message));

          await saveSensorData({
            type: 'umidade',
            value: message,
          });
        }

        if (topic === 'casa/luz') {
          setIsLighton(message === '1');

          await saveSensorData({
            type: 'luz',
            value: message,
          });
        }
      },

      () => {
        console.log('MQTT conectado');
        setIsConnected(true);

        mqtt.subscribe('casa/temp');
        mqtt.subscribe('casa/umid');
        mqtt.subscribe('casa/luz');
      },

      (err) => {
        console.log('Erro MQTT:', err);
        setIsConnected(false);
        setShowError(true);
      }
    );
  };

  const toggleLight = () => {
    const newState = !isLighton;

    setIsLighton(newState);

    mqtt.publish('casa/luz', newState ? '1' : '0');
  };

  const loadHistory = async () => {
    const data = await getSensorHistory();

    setHistory(data);
    setShowHistory(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Smart Home IoT</Text>

      <Text style={styles.status}>
        {isConnected ? 'MQTT Online' : 'MQTT Offline'}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={loadHistory}
      >
        <Text style={styles.buttonText}>
          Ver dados salvos
        </Text>
      </TouchableOpacity>

      <LightControl
        isLighton={isLighton}
        onToggle={toggleLight}
      />

      <Gauges temp={temp} hum={hum} />

      {showHistory && (
        <View style={styles.historyBox}>
          <Text style={styles.historyTitle}>
            Histórico
          </Text>

          {history.map((item, index) => (
            <Text key={index} style={styles.historyItem}>
              {item.timestamp} - {item.type}: {item.value}
            </Text>
          ))}
        </View>
      )}

      <StatusModal
        visible={showError}
        onRetry={startConnection}
        onLater={() => setShowError(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#121212',
    alignItems: 'center',
  },

  header: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 10,
  },

  status: {
    color: '#00FF99',
    marginBottom: 15,
  },

  button: {
    backgroundColor: '#00FF99',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },

  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },

  historyBox: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#1E1E1E',
    padding: 10,
    borderRadius: 8,
  },

  historyTitle: {
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },

  historyItem: {
    color: '#CCC',
    fontSize: 12,
  },
});