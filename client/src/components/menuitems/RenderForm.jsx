import React from 'react';
import styled from 'styled-components';

const Label = styled.label`
  display: block;
  position: relative;
  padding: 10px 0 0 0;
  margin: 0;
`;
const Input = styled.input`font-size: 1.5rem;`;

const InputContainer = styled.div`
  display: inline-block;
  margin-left: 20px;
`;

const RenderForm = ({ itemData, index, onChange }) => {
  const FORM_OBJECT = [
    { label: 'Menu Item Name:', name: 'itemName', placeholder: '' },
    { label: 'Category:', name: 'itemCategory', placeholder: '' },
    { label: 'Menu Item Cost:', name: 'itemCost', placeholder: '$' },
    { label: 'Menu Item Sales Price::', name: 'itemPrice', placeholder: '$' }
  ];

  return FORM_OBJECT.map(form => {
    return (
      <InputContainer key={form.label}>
        <Label for="name">{form.label}</Label>
        <Input
          required
          type="text"
          onChange={e => onChange(e, index)}
          value={itemData[form.name][index]}
          name={form.name}
          placeholder={form.placeholder}
        />
      </InputContainer>
    );
  });
};

export default RenderForm;
