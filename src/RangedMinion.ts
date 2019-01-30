import Minion from './Minion';

export default class RangedMinion extends Minion {
  constructor(player: number) {
    super(player, 'ranged');
  }
};
