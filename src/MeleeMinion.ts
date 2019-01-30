import Minion from './Minion';

export default class MeleeMinion extends Minion {
  constructor(player: number) {
    super(player, 'melee');
  }
};
