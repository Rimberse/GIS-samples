import { Icon } from "leaflet";
import { IconOptions } from "leaflet";

// Default Custom Icon class
class CustomIcon extends Icon {
    options!: IconOptions;

    constructor(options: IconOptions) {
        super(options);
        this.options = { ...CustomIcon.prototype.options, ...options };
    }
}

// Default Custom Icon options
CustomIcon.prototype.options = {
    iconUrl: '',
    shadowUrl: undefined,
    iconSize: [50, 50],
    shadowSize: [50, 50],
    iconAnchor: [25, 50],
    shadowAnchor: [3, 27],
    popupAnchor: [-7, -35]
}

export { CustomIcon };
