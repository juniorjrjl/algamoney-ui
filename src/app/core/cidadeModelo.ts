import { EstadoModelo } from "./estadoModelo";

export class CidadeModelo {
  codigo?: number;
  nome?: string;
  estado = new EstadoModelo();
}
