import { create, StateCreator } from "zustand";
import { DeviceInterface } from "../../interfaces/device.interface";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface DeviceStore{
    
    device: DeviceInterface;
    setDevice: (data: DeviceInterface) => void;

}

const deviceAPI:StateCreator<
DeviceStore,
[["zustand/devtools", never], ["zustand/immer", never]]>= (set) => ({
    device: {} as DeviceInterface,
    setDevice: (data) => {
        set({ device: data });
    },
})


export const useDeviceStore = create<DeviceStore>()(
    devtools(
        persist(immer(deviceAPI), {
            name: "device-store",
        })
    )
);
