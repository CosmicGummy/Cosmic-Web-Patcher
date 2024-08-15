export type PatchFactory = {
  label: string;
  factory: () => Patch[];
};

export type Patch = {
  name: string;
  patch: string;
  replacements?: Record<string, string | number>;
};
