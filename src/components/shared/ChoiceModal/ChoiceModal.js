import React from 'react';
import './ChoiceModal.scss';

const ChoiceModal = ({ content, options = [], onOptionClick }) => {
  const handleOptionClick = (option) => {
    onOptionClick && onOptionClick(option);
  };

  return (
    <div className="backdrop">
      <div className="choice_container">
        {content && <div className="content">{content}</div>}
        <div className="options">
          {options.map((option, index) => (
            <div
              className="option"
              key={index}
              onClick={() => handleOptionClick(option)}
            >
              <p className="option-ellipsis">{option.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChoiceModal;
