import BoardEntity from './BoardEntity';
import XYZ from './XYZ';

export default interface Cell {
  xyz: XYZ;
  object: BoardEntity;
}
