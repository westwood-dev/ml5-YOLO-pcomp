// Simple sketch to read a potentiometer on pin A0,
// and write it's value to Serial

void setup()
{
 // initialize the serial communications:
 Serial.begin(9600);
}
void loop()
{
  // read the input pin:
  int pot = analogRead(A0);

  // print it out the serial port:
  Serial.println(pot);
  
  // Delay to stabilise
  delay(10);
}