import React from 'react';
import styled from 'styled-components';

const Label = styled.label`
  display: block;
  position: relative;
  padding: 10px 0 0 0;
  margin: 0;
`;
const Input = styled.input`
  font-size: 1.5rem;
  width: ${prompt => prompt.width};
`;

const InputContainer = styled.div`
  display: inline-block;
  width: ${prompt => prompt.width};
`;

const RenderForm = ({ itemData, index, onChange }) => {
  const FORM_OBJECT = [
    { label: 'Menu Item Name', name: 'name', placeholder: '', width: '21' },
    { label: 'Category', name: 'category', placeholder: '', width: '15' },
    { label: 'Menu Item Cost', name: 'cost', placeholder: '$', width: '13' },
    { label: 'Menu Item Sales Price', name: 'price', placeholder: '$', width: '13' }
  ];

  return FORM_OBJECT.map(form => {
    return (
      <InputContainer key={form.label} width={`${form.width}rem`}>
        <Label for="name">{form.label}</Label>
        <Input
          required
          width={`${form.width - 2}rem`}
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
