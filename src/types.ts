export interface Variable {
  id: string;
  name: string;
  type: string;
  visibility: 'public' | 'private' | 'protected';
}

export interface Method {
  id: string;
  name: string;
  returnType: string;
  parameters: string;
  visibility: 'public' | 'private' | 'protected';
}

export interface UMLClass {
  id: string;
  name: string;
  x: number;
  y: number;
  variables: Variable[];
  methods: Method[];
}

export interface Connection {
  id: string;
  fromClass: string;
  toClass: string;
  fromHandle: 'top' | 'right' | 'bottom' | 'left';
  toHandle: 'top' | 'right' | 'bottom' | 'left';
}

export interface ContextMenu {
  x: number;
  y: number;
  visible: boolean;
}