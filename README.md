https://youtu.be/4g7r8jorycc?feature=shared
Smart Home IoT – React Native + MQTT
Visão Geral
Este projeto consiste em um aplicativo mobile desenvolvido em React Native (Expo) que realiza comunicação em tempo real com dispositivos IoT através do protocolo MQTT, permitindo:
Controle remoto de uma luz inteligente
Persistência local dos dados coletados
Visualização de histórico de leituras

Tecnologias Utilizadas
React Native (Expo)
MQTT (HiveMQ Cloud)
AsyncStorage (persistência local)
JavaScript
react-native-mqtt

Arquitetura do Sistema
O sistema é dividido em três camadas principais:

Comunicação (MQTT)
Conexão com broker HiveMQ Cloud
Tópicos utilizados:
casa/temp
casa/umid
casa/luz

Aplicação Mobile
Interface desenvolvida em React Native
Componentes:
Controle de luz
Modal de status de conexão
Persistência de Dados
Implementada com AsyncStorage
Cada leitura recebida via MQTT é salva localmente
Dados incluem:
Tipo do sensor
Valor recebido
Timestamp
Fluxo de Dados
MQTT.fx publica dados no broker
Aplicativo React Native se inscreve nos tópicos MQTT
Dados são recebidos em tempo real
Interface é atualizada automaticamente
Dados são armazenados localmente no dispositivo

Funcionalidades
 Conexão com broker MQTT
 Controle de luz via MQTT
 Persistência de dados local
 Histórico de leituras
 Visualização no app
📊 Persistência de Dados

O histórico é armazenado utilizando AsyncStorage:

Cada mensagem MQTT recebida é salva
Dados são armazenados em formato JSON
Possibilidade de recuperação via botão “Ver dados salvos”
