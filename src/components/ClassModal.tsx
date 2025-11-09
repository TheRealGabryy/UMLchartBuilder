import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { UMLClass, Variable, Method } from '../types';

interface ClassModalProps {
  onClose: () => void;
  onCreateClass: (classData: Omit<UMLClass, 'id' | 'x' | 'y'>) => void;
}

const ClassModal: React.FC<ClassModalProps> = ({ onClose, onCreateClass }) => {
  const [className, setClassName] = useState('');
  const [variables, setVariables] = useState<Variable[]>([]);
  const [methods, setMethods] = useState<Method[]>([]);

  const getVisibilitySymbol = (visibility: 'public' | 'private' | 'protected') => {
    switch (visibility) {
      case 'public': return '+';
      case 'private': return '-';
      case 'protected': return '#';
    }
  };

  const addVariable = () => {
    const newVariable: Variable = {
      id: Date.now().toString(),
      name: '',
      type: 'string',
      visibility: 'public'
    };
    setVariables([...variables, newVariable]);
  };

  const removeVariable = (id: string) => {
    setVariables(variables.filter(v => v.id !== id));
  };

  const updateVariable = (id: string, field: keyof Variable, value: any) => {
    setVariables(variables.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ));
  };

  const addMethod = () => {
    const newMethod: Method = {
      id: Date.now().toString(),
      name: '',
      returnType: 'void',
      parameters: '',
      visibility: 'public'
    };
    setMethods([...methods, newMethod]);
  };

  const removeMethod = (id: string) => {
    setMethods(methods.filter(m => m.id !== id));
  };

  const updateMethod = (id: string, field: keyof Method, value: any) => {
    setMethods(methods.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const handleCreate = () => {
    if (className.trim()) {
      onCreateClass({
        name: className,
        variables,
        methods
      });
    }
  };

  const cycleVisibility = (current: 'public' | 'private' | 'protected'): 'public' | 'private' | 'protected' => {
    switch (current) {
      case 'public': return 'private';
      case 'private': return 'protected';
      case 'protected': return 'public';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Create UML Class</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Class Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class Name
            </label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter class name"
              autoFocus
            />
          </div>

          {/* Variables Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-800">Variables</h3>
              <button
                onClick={addVariable}
                className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <Plus size={16} className="mr-1" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {variables.map((variable) => (
                <div key={variable.id} className="flex items-center space-x-2">
                  <button
                    onClick={() => updateVariable(variable.id, 'visibility', cycleVisibility(variable.visibility))}
                    className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center font-mono text-sm hover:bg-gray-50"
                  >
                    {getVisibilitySymbol(variable.visibility)}
                  </button>
                  <input
                    type="text"
                    value={variable.name}
                    onChange={(e) => updateVariable(variable.id, 'name', e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Variable name"
                  />
                  <input
                    type="text"
                    value={variable.type}
                    onChange={(e) => updateVariable(variable.id, 'type', e.target.value)}
                    className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Type"
                  />
                  <button
                    onClick={() => removeVariable(variable.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Minus size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Methods Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-800">Methods</h3>
              <button
                onClick={addMethod}
                className="flex items-center px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                <Plus size={16} className="mr-1" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {methods.map((method) => (
                <div key={method.id} className="flex items-center space-x-2">
                  <button
                    onClick={() => updateMethod(method.id, 'visibility', cycleVisibility(method.visibility))}
                    className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center font-mono text-sm hover:bg-gray-50"
                  >
                    {getVisibilitySymbol(method.visibility)}
                  </button>
                  <input
                    type="text"
                    value={method.name}
                    onChange={(e) => updateMethod(method.id, 'name', e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Method name"
                  />
                  <input
                    type="text"
                    value={method.parameters}
                    onChange={(e) => updateMethod(method.id, 'parameters', e.target.value)}
                    className="w-32 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Parameters"
                  />
                  <input
                    type="text"
                    value={method.returnType}
                    onChange={(e) => updateMethod(method.id, 'returnType', e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Return"
                  />
                  <button
                    onClick={() => removeMethod(method.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Minus size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!className.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassModal;