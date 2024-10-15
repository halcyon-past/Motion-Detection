#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#define PIR_PIN D2

const char* ssid = "YourWifiSSID";
const char* password = "YourWifiPassword";
const char* mqttServer = "broker.hivemq.com";
const int mqttPort = 1883;
const char* mqttTopic = "motion-detection/events";

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(9600);
  delay(10);

  pinMode(PIR_PIN, INPUT);

  // Connect to WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // Set MQTT server and port
  client.setServer(mqttServer, mqttPort);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }

  client.loop();

  int motionValue = digitalRead(PIR_PIN);
  sendMotionData(motionValue == HIGH);

  delay(1000);
}

void reconnect() {
  // Reconnect until successful
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");

    // Attempt to connect (clientID must be unique, you can add a random number)
    if (client.connect("ESP8266Client")) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      delay(2000);
    }
  }
}

void sendMotionData(bool motionDetected) {
  // Create the JSON payload
  String jsonPayload = "{\"motion\": " + String(motionDetected ? "true" : "false") + "}";
  Serial.println("Publishing motion data: " + jsonPayload);

  // Publish the motion event to the MQTT topic
  client.publish(mqttTopic, jsonPayload.c_str());
}
