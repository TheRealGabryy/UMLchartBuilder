# UML Diagram Editor

## Installation

To install and run the UML Diagram Editor, follow these steps:

1. Clone the repository:
```
git clone https://github.com/TheRealGabryy/UMLchartBuilder.git
```
2. Navigate to the project directory:
```
cd uml-diagram-editor
```
3. Install the dependencies:
```
npm install
```
4. Start the development server:
```
npm run dev
```
The application will be available at `http://localhost:3000`.

## Usage

The UML Diagram Editor allows you to create and manage UML class diagrams. You can perform the following actions:

- Right-click on the canvas to add a new class.
- Drag and drop the class blocks to move them around.
- Use the connection handles on the class blocks to create connections between classes.
- Zoom in and out using Ctrl + mouse wheel.
- Pan the canvas by dragging with the mouse.

## API

The application uses the following types to represent the UML diagram elements:

```typescript
interface Variable {
  id: string;
  name: string;
  type: string;
  visibility: 'public' | 'private' | 'protected';
}

interface Method {
  id: string;
  name: string;
  returnType: string;
  parameters: string;
  visibility: 'public' | 'private' | 'protected';
}

interface UMLClass {
  id: string;
  name: string;
  x: number;
  y: number;
  variables: Variable[];
  methods: Method[];
}

interface Connection {
  id: string;
  fromClass: string;
  toClass: string;
  fromHandle: 'top' | 'right' | 'bottom' | 'left';
  toHandle: 'top' | 'right' | 'bottom' | 'left';
}
```

## Contributing

If you would like to contribute to the UML Diagram Editor, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your forked repository.
5. Submit a pull request to the main repository.

## License

This project is licensed under the [MIT License](LICENSE).

## Testing

To run the tests for the UML Diagram Editor, use the following command:

```
npm test
```

This will run the test suite and report the results.
