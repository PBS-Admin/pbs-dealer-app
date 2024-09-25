import React from 'react';

const FinalizeQuote = ({ values, handleChange }) => {
  return (
    <>
      <section className="card start">
        <header className="cardHeader">
          <h3>Finalize Quote</h3>
        </header>
        <div className="cardGrid">
          <div className="cardInput">
            <button type="submit" className="button success">
              Save Quote
            </button>
            <button
              className="button accent"
              onClick={() => {
                alert('This is not built yet');
              }}
            >
              Submit Quote
            </button>
            <button
              className="button prim"
              onClick={() => {
                console.log(values);
              }}
            >
              Export to MBS
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default FinalizeQuote;
