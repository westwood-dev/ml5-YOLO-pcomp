// Simple sketch to read a potentiometer on pin A0,
// and write it's value to Serial

void setup()
{
 // initialize the serial communications:
 Serial.begin(9600);
}
void loop()
{
  // read the input pins:
  int timelinePot = analogRead(A0);
  int confidencePot = analogRead(A1);

  // Print it out the serial port, with the structure: "timelinePot/confidencePot"
  // This allows us to send two values with one serial print
  Serial.println(String(timelinePot)+"/"+String(confidencePot));
  
  // Delay to stabilise
  delay(10);
}