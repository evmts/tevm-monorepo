export interface Plugin<TConfig> {
  name: string;
  config: TConfig;
  include: string[];
  exclude: string[];
}

