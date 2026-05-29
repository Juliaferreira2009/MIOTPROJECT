import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@iot_history';

export async function saveSensorData(data) {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);

    const history = existing ? JSON.parse(existing) : [];

    history.push({
      ...data,
      timestamp: new Date().toISOString(),
    });

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(history)
    );

    console.log('Dados salvos:', data);
  } catch (error) {
    console.log('Erro ao salvar:', error);
  }
}

export async function getSensorHistory() {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);

    const parsed = data ? JSON.parse(data) : [];

    console.log('Histórico recuperado:', parsed);

    return parsed;
  } catch (error) {
    console.log('Erro ao recuperar:', error);
    return [];
  }
}