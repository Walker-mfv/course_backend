interface ProjectOptions {
  [key: string]: number | ProjectOptions
}

export default interface IFindOptions {
  lookupMode?: 'detail' | 'basic'
  project?: ProjectOptions
}
