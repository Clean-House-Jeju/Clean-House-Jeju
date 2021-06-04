import WasteAppliances from "./WasteAppliances";
import React from "react";
import Dumpster from "./Dumpster";
import OtherWaste from "./OtherWaste";
import appliance from '../../../../lib/img/폐가전.svg';
import dumpster from '../../../../lib/img/대형폐기물.svg';
import other from '../../../../lib/img/기타.svg';

export const list = [

    {
        id: 0,
        title: '폐가전 제품 배출 방법',
        component: <WasteAppliances/>,
        img: appliance
    },
    {
        id: 1,
        title: "대형 폐기물 배출 방법",
        component: <Dumpster/>,
        img: dumpster
    },
    {
        id: 2,
        title: '기타 폐기물 배출 방법',
        component: <OtherWaste/>,
        img: other
    }
]
