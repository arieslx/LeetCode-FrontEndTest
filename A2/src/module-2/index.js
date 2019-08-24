import { shuffle, keys } from 'lodash'
import { sample } from '../common'

export function logData(data) {
  console.log('test');
  return sample(shuffle(keys(data)))
}
