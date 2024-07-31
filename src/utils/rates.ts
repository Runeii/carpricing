
export type CarRate = {
  brand: string,
  name: string,
  day?: number,
  hour: number,
  kilometer: number,
  type?: string,
  price?: number,
  maxHours?: number,
  includedKilometers?: number,
}

const GREENWHEELS_CAR_TYPES = {
  budget: "96f1ccd6-4698-4f11-81bb-3d9f376dfb1c",
  electric: "cf11c7d7-58d6-4fbf-aac0-7ed3270cb4ec",
  large: "575676ed-a643-4d4a-b2b2-7b3398cc6c1d",
}

export const getGreenwheelsRates = async (): Promise<CarRate[]> => {
  const url = 'https://www.greenwheels.nl/en-us/rates';

  const response = await fetch(url);
  const text = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');

  if (!doc) {
    throw new Error('Error parsing HTML');
  }

  const cards = doc.querySelectorAll('.js-subscriptions-slider-wrapper > div');

  const occasional = [] as CarRate[];
  const options = Object.entries(GREENWHEELS_CAR_TYPES);
  cards.forEach(card => {
    if (card.querySelector('.m-subscription-tile__title')?.textContent?.trim() !== 'Occasional') {
      return;
    }

    const [type, id] = options.find(([, id]) => id === card.attributes.getNamedItem('data-car-type')?.value) ?? [];
    if (!type) {
      console.log('Unknown car type', card.attributes);
      return;
    }

    const formatPrice = (price: string) => parseFloat(price.trim().replace(/[^0-9,]/g, '').replace(',', '.'));

    const priceContainer = card.querySelector('.m-subscription-tile__prices');
    const hour = formatPrice(priceContainer.children[0]?.textContent ?? '');
    const kilometer = formatPrice(priceContainer.children[1]?.textContent ?? '');

    const result: CarRate = {
      brand: 'Greenwheels',
      name: type,
      day: undefined,
      hour,
      kilometer
    };

    occasional.push(result);
  })

  return occasional;
}


export const getMyWheelsRates = async (): Promise<CarRate[]> => {
  const url = 'https://mywheels.nl/en/tarieven';

  const response = await fetch(url);
  const text = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');

  if (!doc) {
    throw new Error('Error parsing HTML');
  }

  const cards = doc.querySelectorAll('.content_block--ComponentBlockComparisonTab [class*="content_block--ComponentAtomCarCard"]');
  const occasional = [] as CarRate[];
  cards.forEach(card => {
    const type = card.querySelector('[class*="ComponentAtomCarCard_title"]')?.textContent?.trim();
    if (!type) {
      console.log('Unknown car type', card.attributes);
      return;
    }

    const formatPrice = (price: string) => parseFloat(price.trim().replace(/[^0-9,]/g, '').replace(',', '.'));

    const priceContainer = card.querySelector('[class*="ComponentAtomCarCard_text"]');
    const hour = formatPrice(priceContainer?.children[0]?.innerText ?? '');
    const day = formatPrice(priceContainer?.children[1]?.innerText ?? '');
    const kilometer = formatPrice(priceContainer?.children[2]?.innerText ?? '');

    const result: CarRate = {
      brand: 'MyWheels',
      name: type,
      day,
      hour,
      kilometer
    };

    occasional.push(result);
  })

  return occasional;
}


export const getShareNowRates = async (): Promise<CarRate[]> => {
  const url = 'https://www.share-now.com/nl/en/pricing/';

  const response = await fetch(url);
  const text = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');

  if (!doc) {
    throw new Error('Error parsing HTML');
  }

  const cards = doc.querySelectorAll(".information-section__columns .card__info");
  const occasional = [] as CarRate[];
  cards.forEach(card => {
    const type = card.querySelector('.card__title')?.textContent?.trim();
    if (!type) {
      console.log('Unknown car type', card.attributes);
      return;
    }

    const formatPrice = (price: string) => parseFloat(price.trim().replace(/[^0-9,]/g, '').replace(',', '.'));

    const priceContainer = card.querySelectorAll('.card__content p strong') as NodeListOf<HTMLElement>;
    const hour = formatPrice(priceContainer[3]?.innerText ?? '');
    const day = undefined;

    // Might not be correct for hourly?
    const kilometer = 0.39

    const result: CarRate = {
      brand: 'ShareNow',
      name: type,
      day,
      hour,
      kilometer,
      maxHours: 6,
      // Might not be correct for hourly?
      includedKilometers: 200
    };

    occasional.push(result);
  })

  return occasional;
}