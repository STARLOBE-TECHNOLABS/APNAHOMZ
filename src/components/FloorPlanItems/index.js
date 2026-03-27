import Bad from "./Bad";
import Door from "./Door"
import SingleBad from "./SingleBad";
import Window from "./Window"
import Table from "./Table";
import Table2 from "./Table2";
import RoundTable from "./RoundTable";
import DiningChair from "./DiningChair";
import DiningBench from "./DiningBench";
import BuffetCabinet from "./BuffetCabinet";
import CrockeryCabinet from "./CrockeryCabinet";
import BarCabinet from "./BarCabinet";
import Bath from "./Bath";
import Sink from "./Sink";
import Stove from "./Stove";
import Sofa from "./Sofa";
import Toilet from "./Toilet";
import Wordrobe from "./Wordrobe";
import Worktop from "./Worktop";
import Tv from "./Tv";
import Cabinet from "./Cabinet";
import Text from "./Text";
import Flower from "./Flower"
import Flower2 from "./Flower2";
import CoffeeTable from "./CoffeeTable";
import Armchair from "./Armchair";
import ReclinerChair from "./ReclinerChair";
import Ottoman from "./Ottoman";
import SideTable from "./SideTable";
import Bookshelf from "./Bookshelf";
import Rug from "./Rug";
import LShapeSofa from "./LShapeSofa";
import Lamp from "./Lamp";
import Curtains from "./Curtains";
import BaseCabinet from "./BaseCabinet";
import WallCabinet from "./WallCabinet";
import TallPantryUnit from "./TallPantryUnit";
import KitchenIsland from "./KitchenIsland";
import BreakfastCounter from "./BreakfastCounter";
import BarStool from "./BarStool";
import SpiceRack from "./SpiceRack";
import PullOutBasket from "./PullOutBasket";
import PlateRack from "./PlateRack";
import Refrigerator from "./Refrigerator";
import KingBed from "./KingBed";
import Headboard from "./Headboard";
import BedsideTable from "./BedsideTable";
import WardrobeSliding from "./WardrobeSliding";
import WardrobeHinged from "./WardrobeHinged";
import WalkInCloset from "./WalkInCloset";
import Dresser from "./Dresser";
import ChestOfDrawers from "./ChestOfDrawers";
import VanityTable from "./VanityTable";
import AccentChair from "./AccentChair";
import GuestDoubleBed from "./GuestDoubleBed";
import GuestSingleBed from "./GuestSingleBed";
import GuestWardrobe from "./GuestWardrobe";
import GuestBedsideTable from "./GuestBedsideTable";
import StudyDesk from "./StudyDesk";
import StudyChair from "./StudyChair";
import WallMirror from "./WallMirror";
import LuggageRack from "./LuggageRack";
import BunkBed from "./BunkBed";
import ToyStorage from "./ToyStorage";
import BeanBag from "./BeanBag";
import PinBoard from "./PinBoard";
import MirrorCabinet from "./MirrorCabinet";
import ShowerEnclosure from "./ShowerEnclosure";
import TowelRack from "./TowelRack";
import MedicineCabinet from "./MedicineCabinet";
import LaundryBasket from "./LaundryBasket";
import WashingMachine from "./WashingMachine";
import OfficeDesk from "./OfficeDesk";
import ExecutiveDesk from "./ExecutiveDesk";
import ErgonomicChair from "./ErgonomicChair";
import VisitorChair from "./VisitorChair";
import FilingCabinet from "./FilingCabinet";
import WallShelves from "./WallShelves";
import DeskLamp from "./DeskLamp";
import Whiteboard from "./Whiteboard";
import DesktopLaptop from "./DesktopLaptop";
import ConsoleTable from "./ConsoleTable";
import ShoeRack from "./ShoeRack";
import ShoeCabinet from "./ShoeCabinet";
import EntrywayBench from "./EntrywayBench";
import CoatRack from "./CoatRack";
import UmbrellaStand from "./UmbrellaStand";
import WashingMachineBase from "./WashingMachineBase";
import DryerStand from "./DryerStand";
import IroningBoardCabinet from "./IroningBoardCabinet";
import UtilitySink from "./UtilitySink";
import OutdoorChair from "./OutdoorChair";
import OutdoorSofa from "./OutdoorSofa";
import SwingChair from "./SwingChair";
import Planter from "./Planter";
import StorageBench from "./StorageBench";
import BarbecueStation from "./BarbecueStation";
import StorageRack from "./StorageRack";
import ToolCabinet from "./ToolCabinet";
import Workbench from "./Workbench";
import WallHook from "./WallHook";
import BicycleStand from "./BicycleStand";
import DisplayCabinet from "./DisplayCabinet";
import Chandelier from "./Chandelier";

const floorPlanItems = {
  door: {
    component: Door,
    label: "Door",
    size: {
      width: 60,
      height: 60
    }
  },
  window: {
    component: Window,
    label: "Window",
    size: {
      width: 90,
      height: 10
    }
  },
  bad: {
    component: Bad,
    label: "Bad",
    size: {
      width: 110,
      height: 150
    }
  },
  singleBad: {
    component: SingleBad,
    label: "Single bad",
    size: {
      width: 70,
      height: 150
    }
  },
  kingBed: {
    component: KingBed,
    label: "King/Queen Bed",
    size: {
      width: 200,
      height: 180
    }
  },
  headboard: {
    component: Headboard,
    label: "Headboard",
    size: {
      width: 200,
      height: 25
    }
  },
  bedsideTable: {
    component: BedsideTable,
    label: "Bedside Table",
    size: {
      width: 45,
      height: 45
    }
  },
  wardrobeSliding: {
    component: WardrobeSliding,
    label: "Wardrobe Sliding",
    size: {
      width: 160,
      height: 60
    }
  },
  wardrobeHinged: {
    component: WardrobeHinged,
    label: "Wardrobe Hinged",
    size: {
      width: 160,
      height: 60
    }
  },
  walkInCloset: {
    component: WalkInCloset,
    label: "Walk-in Closet",
    size: {
      width: 200,
      height: 140
    }
  },
  dresser: {
    component: Dresser,
    label: "Dresser",
    size: {
      width: 120,
      height: 50
    }
  },
  chestOfDrawers: {
    component: ChestOfDrawers,
    label: "Chest of Drawers",
    size: {
      width: 90,
      height: 50
    }
  },
  vanityTable: {
    component: VanityTable,
    label: "Vanity Table",
    size: {
      width: 120,
      height: 50
    }
  },
  accentChair: {
    component: AccentChair,
    label: "Accent Chair",
    size: {
      width: 75,
      height: 70
    }
  },
  table: {
    component: Table,
    label: "Table",
    size: {
      width: 130,
      height: 90
    }
  },
  table2: {
    component: Table2,
    label: "Table2",
    size: {
      width: 60,
      height: 90
    }
  },
  cabinet: {
    component: Cabinet,
    label: "cabinet",
    size: {
      width: 110,
      height: 60
    }
  },
  vanityCabinet: {
    component: Cabinet,
    label: "Vanity Cabinet",
    size: {
      width: 110,
      height: 60
    }
  },
  roundTable: {
    component: RoundTable,
    label: "Round table",
    size: {
      width: 130,
      height: 130
    }
  },
  diningChair: {
    component: DiningChair,
    label: "Dining Chair",
    size: {
      width: 45,
      height: 45
    }
  },
  diningBench: {
    component: DiningBench,
    label: "Bench Seating",
    size: {
      width: 160,
      height: 45
    }
  },
  buffetCabinet: {
    component: BuffetCabinet,
    label: "Buffet Cabinet / Sideboard",
    size: {
      width: 160,
      height: 50
    }
  },
  crockeryCabinet: {
    component: CrockeryCabinet,
    label: "Crockery Cabinet",
    size: {
      width: 120,
      height: 45
    }
  },
  barCabinet: {
    component: BarCabinet,
    label: "Bar Cabinet / Wine Rack",
    size: {
      width: 100,
      height: 45
    }
  },
  bath: {
    component: Bath,
    label: "Bath",
    size: {
      width: 160,
      height: 70
    }
  },
  sink: {
    component: Sink,
    label: "Sink",
    size: {
      width: 70,
      height: 40
    }
  },
  stove: {
    component: Stove,
    label: "Stove",
    size: {
      width: 70,
      height: 60
    }
  },
  sofa: {
    component: Sofa,
    label: "Sofa",
    size: {
      width: 180,
      height: 70
    }
  },
  toilet: {
    component: Toilet,
    label: "Toilet",
    size: {
      width: 50,
      height: 60
    }
  },
  wordrobe: {
    component: Wordrobe,
    label: "Wordrobe",
    size: {
      width: 130,
      height: 60
    }
  },
  worktop: {
    component: Worktop,
    label: "Worktop",
    size: {
      width: 150,
      height: 60
    }
  },
  tv: {
    component: Tv,
    label: "Tv",
    size: {
      width: 130,
      height: 40
    }
  },
  text: {
    component: Text,
    label: "Text",
    size: {
      width: 80,
      height: 30
    }
  },
  flower: {
    component: Flower,
    label: "Flower",
    size: {
      width: 55,
      height: 55
    }
  },
  flower2: {
    component: Flower2,
    label: "Flower2",
    size: {
      width: 50,
      height: 50
    }
  },
  coffeeTable: {
    component: CoffeeTable,
    label: "Coffee Table",
    size: {
      width: 120,
      height: 60
    }
  },
  armchair: {
    component: Armchair,
    label: "Armchair",
    size: {
      width: 80,
      height: 65
    }
  },
  reclinerChair: {
    component: ReclinerChair,
    label: "Recliner",
    size: {
      width: 80,
      height: 80
    }
  },
  ottoman: {
    component: Ottoman,
    label: "Ottoman",
    size: {
      width: 50,
      height: 50
    }
  },
  sideTable: {
    component: SideTable,
    label: "Side Table",
    size: {
      width: 45,
      height: 45
    }
  },
  bookshelf: {
    component: Bookshelf,
    label: "Bookshelf",
    size: {
      width: 120,
      height: 35
    }
  },
  rug: {
    component: Rug,
    label: "Rug",
    size: {
      width: 200,
      height: 140
    }
  },
  lShapeSofa: {
    component: LShapeSofa,
    label: "L-Shape Sofa",
    size: {
      width: 180,
      height: 165
    }
  },
  lamp: {
    component: Lamp,
    label: "Lamp",
    size: {
      width: 30,
      height: 30
    }
  },
  curtains: {
    component: Curtains,
    label: "Curtains",
    size: {
      width: 100,
      height: 35
    }
  },
  baseCabinet: {
    component: BaseCabinet,
    label: "Base Cabinet",
    size: {
      width: 60,
      height: 60
    }
  },
  wallCabinet: {
    component: WallCabinet,
    label: "Wall Cabinet",
    size: {
      width: 60,
      height: 35
    }
  },
  tallPantryUnit: {
    component: TallPantryUnit,
    label: "Tall Pantry",
    size: {
      width: 60,
      height: 60
    }
  },
  kitchenIsland: {
    component: KitchenIsland,
    label: "Kitchen Island",
    size: {
      width: 180,
      height: 90
    }
  },
  breakfastCounter: {
    component: BreakfastCounter,
    label: "Breakfast Counter",
    size: {
      width: 220,
      height: 45
    }
  },
  barStool: {
    component: BarStool,
    label: "Bar Stool",
    size: {
      width: 40,
      height: 40
    }
  },
  spiceRack: {
    component: SpiceRack,
    label: "Spice Rack",
    size: {
      width: 20,
      height: 60
    }
  },
  pullOutBasket: {
    component: PullOutBasket,
    label: "Pull-out Basket",
    size: {
      width: 60,
      height: 60
    }
  },
  plateRack: {
    component: PlateRack,
    label: "Plate Rack",
    size: {
      width: 80,
      height: 40
    }
  },
  refrigerator: {
    component: Refrigerator,
    label: "Refrigerator",
    size: {
      width: 90,
      height: 90
    }
  },
  guestDoubleBed: {
    component: GuestDoubleBed,
    label: "Guest Double Bed",
    size: {
      width: 160,
      height: 200
    }
  },
  guestSingleBed: {
    component: GuestSingleBed,
    label: "Guest Single Bed",
    size: {
      width: 100,
      height: 200
    }
  },
  guestWardrobe: {
    component: GuestWardrobe,
    label: "Guest Wardrobe",
    size: {
      width: 150,
      height: 60
    }
  },
  guestBedsideTable: {
    component: GuestBedsideTable,
    label: "Guest Bedside Table",
    size: {
      width: 50,
      height: 40
    }
  },
  studyDesk: {
    component: StudyDesk,
    label: "Study Desk",
    size: {
      width: 120,
      height: 60
    }
  },
  studyChair: {
    component: StudyChair,
    label: "Study Chair",
    size: {
      width: 45,
      height: 45
    }
  },
  wallMirror: {
    component: WallMirror,
    label: "Wall Mirror",
    size: {
      width: 80,
      height: 5
    }
  },
  luggageRack: {
    component: LuggageRack,
    label: "Luggage Rack",
    size: {
      width: 80,
      height: 50
    }
  },
  bunkBed: {
    component: BunkBed,
    label: "Bunk Bed",
    size: {
      width: 100,
      height: 200
    }
  },
  toyStorage: {
    component: ToyStorage,
    label: "Toy Storage",
    size: {
      width: 100,
      height: 50
    }
  },
  beanBag: {
    component: BeanBag,
    label: "Bean Bag",
    size: {
      width: 80,
      height: 80
    }
  },
  pinBoard: {
    component: PinBoard,
    label: "Pin Board",
    size: {
      width: 100,
      height: 5
    }
  },
  mirrorCabinet: {
    component: MirrorCabinet,
    label: "Mirror Cabinet",
    size: {
      width: 60,
      height: 20
    }
  },
  showerEnclosure: {
    component: ShowerEnclosure,
    label: "Shower Enclosure",
    size: {
      width: 90,
      height: 90
    }
  },
  towelRack: {
    component: TowelRack,
    label: "Towel Rack",
    size: {
      width: 60,
      height: 10
    }
  },
  medicineCabinet: {
    component: MedicineCabinet,
    label: "Medicine Cabinet",
    size: {
      width: 50,
      height: 15
    }
  },
  laundryBasket: {
    component: LaundryBasket,
    label: "Laundry Basket",
    size: {
      width: 50,
      height: 40
    }
  },
  washingMachine: {
    component: WashingMachine,
    label: "Washing Machine",
    size: {
      width: 60,
      height: 60
    }
  },
  officeDesk: {
    component: OfficeDesk,
    label: "Office Desk",
    size: {
      width: 150,
      height: 75
    }
  },
  executiveDesk: {
    component: ExecutiveDesk,
    label: "Executive Desk",
    size: {
      width: 180,
      height: 90
    }
  },
  ergonomicChair: {
    component: ErgonomicChair,
    label: "Ergonomic Chair",
    size: {
      width: 60,
      height: 60
    }
  },
  visitorChair: {
    component: VisitorChair,
    label: "Visitor Chair",
    size: {
      width: 50,
      height: 50
    }
  },
  filingCabinet: {
    component: FilingCabinet,
    label: "Filing Cabinet",
    size: {
      width: 50,
      height: 60
    }
  },
  wallShelves: {
    component: WallShelves,
    label: "Wall Shelves",
    size: {
      width: 100,
      height: 5
    }
  },
  deskLamp: {
    component: DeskLamp,
    label: "Desk Lamp",
    size: {
      width: 20,
      height: 20
    }
  },
  whiteboard: {
    component: Whiteboard,
    label: "Whiteboard",
    size: {
      width: 120,
      height: 5
    }
  },
  desktopLaptop: {
    component: DesktopLaptop,
    label: "Desktop/Laptop",
    size: {
      width: 50,
      height: 40
    }
  },
  consoleTable: {
    component: ConsoleTable,
    label: "Console Table",
    size: {
      width: 120,
      height: 40
    }
  },
  shoeRack: {
    component: ShoeRack,
    label: "Shoe Rack",
    size: {
      width: 80,
      height: 40
    }
  },
  shoeCabinet: {
    component: ShoeCabinet,
    label: "Shoe Cabinet",
    size: {
      width: 80,
      height: 30
    }
  },
  entrywayBench: {
    component: EntrywayBench,
    label: "Entryway Bench",
    size: {
      width: 100,
      height: 40
    }
  },
  coatRack: {
    component: CoatRack,
    label: "Coat Rack",
    size: {
      width: 40,
      height: 40
    }
  },
  umbrellaStand: {
    component: UmbrellaStand,
    label: "Umbrella Stand",
    size: {
      width: 30,
      height: 30
    }
  },
  washingMachineBase: {
    component: WashingMachineBase,
    label: "Washing Machine Base",
    size: {
      width: 60,
      height: 60
    }
  },
  dryerStand: {
    component: DryerStand,
    label: "Dryer Stand",
    size: {
      width: 60,
      height: 60
    }
  },
  ironingBoardCabinet: {
    component: IroningBoardCabinet,
    label: "Ironing Board Cabinet",
    size: {
      width: 40,
      height: 10
    }
  },
  utilitySink: {
    component: UtilitySink,
    label: "Utility Sink",
    size: {
      width: 60,
      height: 50
    }
  },
  outdoorChair: {
    component: OutdoorChair,
    label: "Outdoor Chair",
    size: {
      width: 60,
      height: 60
    }
  },
  outdoorSofa: {
    component: OutdoorSofa,
    label: "Outdoor Sofa",
    size: {
      width: 180,
      height: 80
    }
  },
  swingChair: {
    component: SwingChair,
    label: "Swing Chair",
    size: {
      width: 100,
      height: 100
    }
  },
  planter: {
    component: Planter,
    label: "Planter",
    size: {
      width: 40,
      height: 40
    }
  },
  storageBench: {
    component: StorageBench,
    label: "Storage Bench",
    size: {
      width: 120,
      height: 50
    }
  },
  barbecueStation: {
    component: BarbecueStation,
    label: "Barbecue Station",
    size: {
      width: 120,
      height: 60
    }
  },
  storageRack: {
    component: StorageRack,
    label: "Storage Rack",
    size: {
      width: 100,
      height: 40
    }
  },
  toolCabinet: {
    component: ToolCabinet,
    label: "Tool Cabinet",
    size: {
      width: 80,
      height: 40
    }
  },
  workbench: {
    component: Workbench,
    label: "Workbench",
    size: {
      width: 150,
      height: 60
    }
  },
  wallHook: {
    component: WallHook,
    label: "Wall Hook",
    size: {
      width: 10,
      height: 10
    }
  },
  bicycleStand: {
    component: BicycleStand,
    label: "Bicycle Stand",
    size: {
      width: 60,
      height: 40
    }
  },
  displayCabinet: {
    component: DisplayCabinet,
    label: "Display Cabinet",
    size: {
      width: 90,
      height: 40
    }
  },
  chandelier: {
    component: Chandelier,
    label: "Chandelier / Pendant Light",
    size: {
      width: 60,
      height: 60
    }
  }
}

import { BiRestaurant, BiDish, BiBed, BiBath, BiDesktop, BiDoorOpen, BiCycling, BiCabinet, BiBulb, BiLayer } from "react-icons/bi";
import { MdOutlineLocalLaundryService, MdOutlineDeck } from "react-icons/md";

export const furnitureCategories = [
  {
    id: "livingRoom",
    label: "Living Room",
    icon: BiLayer,
    items: ["sofa", "lShapeSofa", "armchair", "reclinerChair", "ottoman", "coffeeTable", "sideTable", "tv", "bookshelf", "displayCabinet", "cabinet", "lamp", "chandelier", "rug", "curtains", "flower", "flower2"]
  },
  {
    id: "diningRoom",
    label: "Dining Room",
    icon: BiRestaurant,
    items: ["table", "table2", "roundTable", "diningChair", "diningBench", "buffetCabinet", "crockeryCabinet", "barCabinet", "chandelier"]
  },
  {
    id: "kitchen",
    label: "Kitchen",
    icon: BiDish,
    items: ["baseCabinet", "wallCabinet", "tallPantryUnit", "kitchenIsland", "breakfastCounter", "barStool", "spiceRack", "pullOutBasket", "plateRack", "refrigerator", "sink", "stove", "worktop"]
  },
  {
    id: "masterBedroom",
    label: "Master Bedroom",
    icon: BiBed,
    items: ["kingBed", "headboard", "bedsideTable", "wardrobeSliding", "wardrobeHinged", "walkInCloset", "dresser", "chestOfDrawers", "vanityTable", "accentChair"]
  },
  {
    id: "guestBedroom",
    label: "Guest Bedroom",
    icon: BiBed,
    items: ["guestDoubleBed", "guestSingleBed", "guestWardrobe", "guestBedsideTable", "studyDesk", "studyChair", "wallMirror", "luggageRack"]
  },
  {
    id: "bedroom",
    label: "Bedroom",
    icon: BiBed,
    items: ["bad", "singleBad", "wordrobe"]
  },
  {
    id: "bathroom",
    label: "Bathroom",
    icon: BiBath,
    items: ["bath", "toilet", "sink", "vanityCabinet", "mirrorCabinet", "showerEnclosure", "wallCabinet", "towelRack", "medicineCabinet", "laundryBasket", "washingMachine"]
  },
  {
    id: "kidsBedroom",
    label: "Kids Bedroom",
    icon: BiDesktop,
    items: ["singleBad", "bunkBed", "studyDesk", "studyChair", "toyStorage", "bookshelf", "wardrobeSliding", "wardrobeHinged", "beanBag", "pinBoard"]
  },
  {
    id: "office",
    label: "Home Office",
    icon: BiDesktop,
    items: ["officeDesk", "executiveDesk", "studyDesk", "ergonomicChair", "visitorChair", "filingCabinet", "bookshelf", "wallShelves", "deskLamp", "whiteboard", "desktopLaptop"]
  },
  {
    id: "entryway",
    label: "Entryway / Foyer",
    icon: BiDoorOpen,
    items: ["consoleTable", "shoeRack", "shoeCabinet", "entrywayBench", "coatRack", "umbrellaStand", "wallMirror"]
  },
  {
    id: "laundry",
    label: "Laundry Room",
    icon: MdOutlineLocalLaundryService,
    items: ["washingMachine", "washingMachineBase", "dryerStand", "laundryBasket", "ironingBoardCabinet", "utilitySink", "baseCabinet", "wallCabinet", "storageRack"]
  },
  {
    id: "outdoor",
    label: "Balcony / Terrace",
    icon: MdOutlineDeck,
    items: ["outdoorChair", "outdoorSofa", "coffeeTable", "swingChair", "planter", "storageBench", "barbecueStation"]
  },
  {
    id: "garage",
    label: "Garage",
    icon: BiCycling,
    items: ["storageRack", "toolCabinet", "workbench", "wallHook", "bicycleStand"]
  }
]

export const furniterMenuItems = Object.keys(floorPlanItems)

export default floorPlanItems;
