export interface GmModel {
  name: string;
  trims: string[];
}

export interface GmBrand {
  name: string;
  models: GmModel[];
}

export interface VehicleListing {
  id: string;
  brand: string;
  model: string;
  trim: string;
  year: number;
  color: string;
  stock: string;
  image: string;
  price?: string;
}

export const GM_BRANDS: GmBrand[] = [
  {
    name: 'Chevrolet',
    models: [
      { name: 'Silverado', trims: ['LT', 'RST', 'High Country'] },
      { name: 'Equinox', trims: ['LT', 'RS', 'Activ'] },
      { name: 'Tahoe', trims: ['LS', 'LT', 'Premier'] },
    ],
  },
  {
    name: 'Cadillac',
    models: [
      { name: 'Escalade', trims: ['Luxury', 'Sport', 'Premium Luxury'] },
      { name: 'Lyriq', trims: ['Luxury', 'Sport'] },
      { name: 'XT5', trims: ['Luxury', 'Premium Luxury'] },
    ],
  },
  {
    name: 'GMC',
    models: [
      { name: 'Sierra', trims: ['SLE', 'Elevation', 'Denali'] },
      { name: 'Yukon', trims: ['SLE', 'SLT', 'Denali'] },
      { name: 'Terrain', trims: ['SLE', 'AT4'] },
    ],
  },
  {
    name: 'Buick',
    models: [
      { name: 'Enclave', trims: ['Preferred', 'Essence', 'Avenir'] },
      { name: 'Envision', trims: ['Preferred', 'Avenir'] },
      { name: 'Encore GX', trims: ['Preferred', 'Sport Touring'] },
    ],
  },
];

const STOCK_COLORS = [
  'Black',
  'White',
  'Silver',
  'Red',
  'Blue',
  'Gray',
  'Bronze',
  'Green',
  'Brown',
  'Pearl',
];

const STOCK_YEARS = [2026, 2025, 2026, 2024, 2025, 2026, 2024, 2025, 2026, 2025];

const CHEVROLET = 'https://www.chevrolet.com/content/dam/chevrolet/na/us/english';

const MODEL_IMAGES: Record<string, string> = {
  'Chevrolet|Silverado': `${CHEVROLET}/vdc-collections/2026/commercial/silverado-1500/nav/2026-silverado-1wt-gaz-driver-front-3quarter-nav.jpg?imwidth=800`,
  'Chevrolet|Equinox': `${CHEVROLET}/vdc-collections/2027/suvs/equinox/nav/2027-equinox-2rs-gnt-driver-front-3quarter-nav.jpg?imwidth=800`,
  'Chevrolet|Tahoe': `${CHEVROLET}/vdc-collections/2026/suvs/tahoe/nav/2026-tahoe-2z7-gbd-driver-front-3quarter-nav.jpg?imwidth=800`,
  'Cadillac|Escalade': `${CHEVROLET}/vdc-collections/2026/suvs/suburban/nav/2026-suburban-3lz-g6m-driver-front-3quarter-nav.jpg?imwidth=800`,
  'Cadillac|Lyriq': `${CHEVROLET}/vdc-collections/2027/suvs/equinox-ev/nav/new/2027-equinox-ev-pde-gjv-driver-front-3quarter-nav.jpg?imwidth=800`,
  'Cadillac|XT5': `${CHEVROLET}/vdc-collections/2026/suvs/blazer/nav/2026-blazer-1rs-gnt-driver-front-3quarter-nav.jpg?imwidth=800`,
  'GMC|Sierra': `${CHEVROLET}/vdc-collections/2026/commercial/silverado-1500/nav/2026-silverado-1wt-gaz-driver-front-3quarter-nav.jpg?imwidth=800`,
  'GMC|Yukon': `${CHEVROLET}/vdc-collections/2026/suvs/tahoe/nav/2026-tahoe-2z7-gbd-driver-front-3quarter-nav.jpg?imwidth=800`,
  'GMC|Terrain': `${CHEVROLET}/vdc-collections/2027/suvs/equinox/nav/2027-equinox-2rs-gnt-driver-front-3quarter-nav.jpg?imwidth=800`,
  'Buick|Enclave': `${CHEVROLET}/vdc-collections/2027/suvs/traverse/nav/2027-traverse-2lz-gb8-driver-front-3quarter-nav.jpg?imwidth=800`,
  'Buick|Envision': `${CHEVROLET}/vdc-collections/2026/suvs/blazer/nav/2026-blazer-1rs-gnt-driver-front-3quarter-nav.jpg?imwidth=800`,
  'Buick|Encore GX': `${CHEVROLET}/vdc-collections/2026/suvs/trax/trims/jpg/2026-trax-1sa-gvr-driver-front-3quarter-nav.jpg?imwidth=800`,
};

const EQUINOX_LISTINGS: VehicleListing[] = [
  ['2026', '1LT', 'Sterling Gray Metallic', '$25,890', 'https://platform.cstatic-images.com/large/in/v2/103945ec-c176-5a51-9225-6981769a47a6/35cb143e-408d-484b-8ae0-9530f6c8d47f/asJcZj3eCvTW7VROxdsAsQerSZs.jpg'],
  ['2026', '1LT', 'Lakeshore Blue Metallic', '$25,990', 'https://platform.cstatic-images.com/large/in/v2/103945ec-c176-5a51-9225-6981769a47a6/16650e56-5f2a-4388-9b8e-545e713a29bc/l1uADdxcqMBR1HellYCSktXmaEc.jpg'],
  ['2027', '1LT', 'Summit White', '$26,150', 'https://platform.cstatic-images.com/large/in/v2/56f5317e-5363-4053-8faa-c63647aa1d75/b5dc46c3-bc61-45f4-ab7e-df11a4f44035/aMAZSUX8xOqLzmCmBFiikTTatQA.jpg'],
  ['2027', '1LT', 'Summit White', '$26,150', 'https://platform.cstatic-images.com/large/in/v2/56f5317e-5363-4053-8faa-c63647aa1d75/ce24d2f5-0c2d-49fd-a098-88d896e4effd/RfaMBGCka9yXeSpEPNLgTqFfnIo.jpg'],
  ['2027', '1LT', 'Radiant Red Tintcoat', '$26,150', 'https://platform.cstatic-images.com/large/in/v2/56f5317e-5363-4053-8faa-c63647aa1d75/6ca6caac-0b7c-4eff-a753-46403c31a89c/zbVJQDc2F3n0eKUZiB7w7kodgPE.jpg'],
  ['2026', '1LT', '', '$26,176', 'https://platform.cstatic-images.com/large/in/v2/103945ec-c176-5a51-9225-6981769a47a6/d72a5cf9-e7a6-424b-a15d-af844834e2be/Hn7ekVHs0ywJaMYFC5y693Gd_BQ.jpg'],
  ['2027', '1LT', '', '$26,180', 'https://platform.cstatic-images.com/large/in/v2/56f5317e-5363-4053-8faa-c63647aa1d75/cf2a375f-938e-44d8-81fc-e88b6da1c691/SdFf63ukw9XSGXL-tpwjYFQpxcE.jpg'],
  ['2027', 'LT', '', '$26,720', 'https://platform.cstatic-images.com/large/in/v2/1fec2822-ad73-53f6-a8c6-5245d1770677/6ee08cb9-6189-470b-9138-d379033e0c20/qVQ9BJf_Y8APByeb9Bfzo9bkxqo.jpg'],
  ['2027', '1LT', '', '$26,995', 'https://platform.cstatic-images.com/large/in/v2/f5fe237c-7195-524e-9436-042b512fa040/38a48fab-5d73-4030-9ec9-df4070ee7e73/uvMaF-0fusne5dS4zLyFn4SbuZk.jpg'],
  ['2027', '1LT', '', '$27,914', 'https://platform.cstatic-images.com/large/in/v2/031d0b0c-4f25-5b4c-9838-68e777c61f02/a04e7913-43c2-410d-983a-f370fc65e110/5vYKkcxr0HrbDLko1VPXbELas64.jpg'],
].map(([year, trim, color, price, image], index) => ({
  id: `equinox-round-rock-${index + 1}`,
  brand: 'Chevrolet',
  model: 'Equinox',
  trim,
  year: Number(year),
  color,
  stock: '',
  price,
  image,
}));

export const GM_LISTINGS: VehicleListing[] = GM_BRANDS.flatMap((brand) =>
  brand.models.flatMap((model) => {
    if (brand.name === 'Chevrolet' && model.name === 'Equinox') {
      return EQUINOX_LISTINGS;
    }
    return model.trims.flatMap((trim) =>
      STOCK_COLORS.map((color, index) => ({
        id: `${brand.name}-${model.name}-${trim}-${index + 1}`
          .toLowerCase()
          .replace(/\s+/g, '-'),
        brand: brand.name,
        model: model.name,
        trim,
        year: STOCK_YEARS[index],
        color,
        stock: `${brand.name.slice(0, 2).toUpperCase()}${model.name.slice(0, 2).toUpperCase()}${String(index + 1).padStart(3, '0')}`,
        image: MODEL_IMAGES[`${brand.name}|${model.name}`],
      })),
    );
  }),
);
