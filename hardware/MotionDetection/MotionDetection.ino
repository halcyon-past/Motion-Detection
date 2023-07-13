#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

#define PIR_PIN D2

const char* ssid = "Xev123";
const char* password = "Xesp8266";
const char* serverAddress = "motion-detection.onrender.com";
const int serverPort = 443;
const char* uri = "/api/motion-events";

WiFiClientSecure client;

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

  client.setInsecure();
}

void loop() {
  int motionValue = digitalRead(PIR_PIN);

  if (motionValue == HIGH) {
    sendMotionData(true);
  } else {
    sendMotionData(false);
  }

  delay(1000);  // Adjust the delay as per your requirement
}

void sendMotionData(bool motionDetected) {
  StaticJsonDocument<200> jsonDoc;
  jsonDoc["motion"] = motionDetected;

  String jsonData;
  serializeJson(jsonDoc, jsonData);

  Serial.println("Sending motion data...");

  if (!client.connect(serverAddress, serverPort)) {
    Serial.println("Connection failed");
    return;
  }

  String postPayload = "{\"motion\": " + String(motionDetected ? "true" : "false") + "}";

  client.print("POST ");
  client.print(uri);
  client.println(" HTTP/1.1");
  client.print("Host: ");
  client.println(serverAddress);
  client.println("Content-Type: application/json");
  client.print("Content-Length: ");
  client.println(postPayload.length());
  client.println();
  client.println(postPayload);

  delay(100);

  while (client.available()) {
    String line = client.readStringUntil('\r');
    Serial.println(line);
  }

  client.stop();
}
