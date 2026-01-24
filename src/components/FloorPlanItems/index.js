import Bad from "./Bad";
import Door from "./Door"
import SingleBad from "./SingleBad";
import Window from "./Window"
import Table from "./Table";
import Table2 from "./Table2";
import RoundTable from "./RoundTable";
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
  roundTable: {
    component: RoundTable,
    label: "Round table",
    size: {
      width: 130,
      height: 130
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
  }
}

export const furniterMenuItems = ["bad", "singleBad", "table", "table2", "roundTable", "bath", "sink", "cabinet", "stove", "sofa", "toilet", "wordrobe", "worktop", "tv", "flower", "flower2"]

export default floorPlanItems;