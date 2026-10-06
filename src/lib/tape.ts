export interface TapeNotification {
  deviceId: string;
  value: number;
}

type Listener = (notification: TapeNotification) => void;

const COMMON_DIMENSIONS = [
  304800, 406400, 457200, 533400, 609600, 762000, 812800, 914400, 1066800, 1219200, 1524000,
  1828800, 2133600, 2438400, 2743200, 3048000, 3657600, 4267200, 4876800, 6096000,
];

const MIN_READING = 50000;
const MAX_READING = 7600000;

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function nextReading() {
  let reading: number;
  if (Math.random() < 0.75) {
    const base = COMMON_DIMENSIONS[Math.floor(Math.random() * COMMON_DIMENSIONS.length)];
    reading = base + randomBetween(-9000, 9000);
  } else {
    reading = randomBetween(MIN_READING, MAX_READING);
  }
  return Math.round(Math.min(MAX_READING, Math.max(MIN_READING, reading)));
}

function randomDeviceId() {
  const suffix = Math.floor(Math.random() * 0xffff)
    .toString(16)
    .toUpperCase()
    .padStart(4, '0');
  return `TP-${suffix}`;
}

class MockTape {
  readonly deviceId = randomDeviceId();
  private listeners = new Set<Listener>();

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  measure() {
    const notification = { deviceId: this.deviceId, value: nextReading() };
    setTimeout(() => this.notify(notification), randomBetween(60, 180));
  }

  private notify(notification: TapeNotification) {
    for (const listener of this.listeners) {
      listener({ ...notification });
    }
  }
}

export const tape = new MockTape();
