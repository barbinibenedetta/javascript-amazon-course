class Car {
  #brand;
  #model;
  speed = 0;
  isTrunkOpen = false;

  constructor(carDetails) {
    this.#brand = carDetails.brand;
    this.#model = carDetails.model;
  }

  displayInfo() {
    console.log(`${this.#brand} ${this.#model}, Speed: ${this.speed} km/h, is the trunk open: ${this.isTrunkOpen}`);
  }

  go() {
    if (this.isTrunkOpen === false) {
      this.speed += 5;
      if (this.speed > 200) {
        this.speed = 200;
      }
    }
  }

  break() {
    this.speed -= 5;
    if (this.speed < 0) {
      this.speed = 0;
    }
  }

  openTrunk() {
    if (this.speed === 0) {
      this.isTrunkOpen = true;
    }
  }

  closeTrunk() {
    this.isTrunkOpen = false;
  }
}

const car1 = new Car({
  brand: 'Toyota',
  model: 'Corolla'
});
const car2 = new Car({
  brand: 'Tesla',
  model: 'Model 3'
});
car1.openTrunk();
car1.go();
car1.displayInfo();
car2.displayInfo();

class RaceCar extends Car {
  acceleration;

  constructor(carDetails) {
    super(carDetails);
    this.acceleration = carDetails.acceleration;
  }

  go() {
    if (this.isTrunkOpen === false) {
      this.speed += this.acceleration;
      if (this.speed > 300) {
        this.speed = 300;
      }
    }
  }

  openTrunk() {}
  closeTrunk() {}
}

const superCar1 = new RaceCar({
  brand: 'McLaren',
  model: 'F1',
  acceleration: 20
});

superCar1.go();
superCar1.displayInfo();

/*
const cars = [
  {
    brand: 'Toyota',
    model: 'Corolla'
  },
  {
    brand: 'Tesla',
    model: 'Model 3'
  }
].map((carDetails) => {
  return new Car(carDetails);
});
*/