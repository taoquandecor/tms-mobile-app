export class ClientLanguage {
    constructor(
        public id: string,
        public name: string,
        public file: string,
        public isDefault: boolean,
        public flag: string | undefined) { }
}
