
int lastPot = 0;

void setup()
{
 // initialize the serial communications:
 Serial.begin(9600);
}
void loop()
{
  
  // read the input pin:
  int pot = analogRead(A0);                  
  // remap the pot value to fit in 1 byte:
  // int mappedPot = map(potentiometer, 0, 1023, 0, 255); 
  if (pot != lastPot) {
  // print it out the serial port:
  Serial.println(pot);
  }
  lastPot = pot;
  // Delay to stabilise
  delay(10);
}