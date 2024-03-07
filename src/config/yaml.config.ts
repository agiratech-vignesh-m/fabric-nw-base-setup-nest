import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILENAME = 'message.yaml';

const localpath = join(__dirname, YAML_CONFIG_FILENAME);
const message = yaml.load(readFileSync(localpath, 'utf8')) as Record<
  string,
  any
>;

export const success = message.success;
export const error = message.error;
