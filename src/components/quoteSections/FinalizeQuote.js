import React from 'react';

const QuoteInformation = ({ values, handleChange }) => {
  return (
    <>
      <section className="card start">
        <header className="cardHeader">
          <h3>Finalize Quote</h3>
        </header>
        <div className="cardGrid">
          <div className="cardInput">
            <button type="submit">Submit Quote</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default QuoteInformation;
