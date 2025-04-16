// FormDemo.js - A demonstration page for database form submissions
const FormDemo = () => {
  const providerFormFields = [
    {
      name: 'name',
      label: 'Nombre del Proveedor',
      type: 'text',
      required: true,
      placeholder: 'Ingrese nombre del proveedor'
    },
    {
      name: 'nit',
      label: 'NIT/ID Fiscal',
      type: 'text',
      required: true,
      placeholder: 'Ingrese NIT o ID fiscal'
    },
    {
      name: 'type',
      label: 'Tipo de Proveedor',
      type: 'select',
      required: false,
      options: [
        { value: 'natural', label: 'Persona Natural' },
        { value: 'juridica', label: 'Persona Jurídica' }
      ]
    },
    {
      name: 'regime',
      label: 'Régimen Fiscal',
      type: 'select',
      required: false,
      options: [
        { value: 'comun', label: 'Régimen Común' },
        { value: 'simplificado', label: 'Régimen Simplificado' }
      ]
    },
    {
      name: 'address',
      label: 'Dirección',
      type: 'text',
      required: false,
      placeholder: 'Ingrese dirección del proveedor'
    },
    {
      name: 'phone',
      label: 'Teléfono',
      type: 'tel',
      required: false,
      placeholder: 'Ingrese número de teléfono'
    },
    {
      name: 'email',
      label: 'Correo Electrónico',
      type: 'email',
      required: false,
      placeholder: 'Ingrese dirección de correo'
    },
    {
      name: 'contactPerson',
      label: 'Persona de Contacto',
      type: 'text',
      required: false,
      placeholder: 'Ingrese nombre de la persona de contacto'
    },
    {
      name: 'observations',
      label: 'Observaciones',
      type: 'textarea',
      required: false,
      placeholder: 'Ingrese observaciones adicionales',
      rows: 3
    }
  ];

  const budgetFormFields = [
    {
      name: 'code',
      label: 'Budget Code',
      type: 'text',
      required: true,
      placeholder: 'Enter budget code'
    },
    {
      name: 'name',
      label: 'Budget Name',
      type: 'text',
      required: true,
      placeholder: 'Enter budget name'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: false,
      placeholder: 'Enter budget description'
    },
    {
      name: 'year',
      label: 'Fiscal Year',
      type: 'number',
      required: true,
      placeholder: 'Enter fiscal year',
      min: 2000,
      max: 2100
    },
    {
      name: 'amount',
      label: 'Amount',
      type: 'number',
      required: true,
      placeholder: 'Enter budget amount',
      min: 0,
      step: 0.01
    }
  ];

  const handleProviderSubmit = async (formData) => {
    try {
      // Add form type to identify the form on the server side
      formData.formType = 'provider';
      
      // Submit the form data to the API
      const response = await window.api.submitForm(formData);
      
      console.log('Provider submitted successfully:', response);
      return response;
    } catch (error) {
      console.error('Error submitting provider:', error);
      throw error;
    }
  };

  const handleBudgetSubmit = async (formData) => {
    try {
      // Add form type to identify the form on the server side
      formData.formType = 'budget';
      
      // Submit the form data to the API
      const response = await window.api.submitForm(formData);
      
      console.log('Budget submitted successfully:', response);
      return response;
    } catch (error) {
      console.error('Error submitting budget:', error);
      throw error;
    }
  };

  return (
    <div className="page-container">
      <h1>Database Form Demo</h1>
      <p>This page demonstrates form submissions to the SQL Server database at 205.209.122.84</p>
      
      <div className="form-grid">
        <div className="form-section">
          <DatabaseForm
            formId="providerForm"
            title="Add New Provider"
            fields={providerFormFields}
            onSubmit={handleProviderSubmit}
            submitButtonText="Add Provider"
          />
        </div>
        
        <div className="form-section">
          <DatabaseForm
            formId="budgetForm"
            title="Add Budget Item"
            fields={budgetFormFields}
            onSubmit={handleBudgetSubmit}
            submitButtonText="Add Budget Item"
          />
        </div>
      </div>
    </div>
  );
}; 