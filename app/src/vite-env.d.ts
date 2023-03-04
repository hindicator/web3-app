/// <reference types="vite/client" />
import type { Eip1193Provider } from "ethers/src.ts/providers/provider-browser";

declare module '*.svg' {
    import React = require('react');
    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    const src: string;
    export default src;
}

declare global {
    interface Window {
        ethereum?: Eip1193Provider;
    }
}