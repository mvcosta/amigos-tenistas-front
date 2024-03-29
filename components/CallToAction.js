import React, { useState } from "react";

import Heading from "./ui/Heading";
import classes from "./CallToAction.module.css";
import Button from "./ui/Button";
import Card from "./ui/Card";
import CallToActionModal from "./CallToActionModal";

import useInput from "../hooks/use-input";
import useHttp from "../hooks/use-http";
import {
  formatPhoneNumber,
  phoneNumberValidation,
} from "../functions/phoneNumberHelper";

const CallToAction = React.forwardRef((props, ref) => {
  const {
    isLoading,
    error,
    errorStatusCode,
    sendRequest: postPlayer,
  } = useHttp();

  const [modalIsShown, setmodalIsShown] = useState(false);

  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameInputHasError,
    valueChangeHandler: nameChangedHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetNameInput,
  } = useInput((value) => value.trim() !== "");

  const {
    value: enteredNumber,
    isValid: enteredNumberIsValid,
    hasError: numberInputHasError,
    valueChangeHandler: numberChangedHandler,
    inputBlurHandler: numberBlurHandler,
    reset: resetNumberInput,
  } = useInput(phoneNumberValidation, formatPhoneNumber);

  const {
    value: enteredExperience,
    isValid: enteredExperienceIsValid,
    hasError: experienceInputHasError,
    valueChangeHandler: experienceChangedHandler,
    inputBlurHandler: experienceBlurHandler,
    reset: resetExperienceInput,
  } = useInput((value) => value.trim() !== "");

  let formIsValid = false;

  if (enteredNameIsValid && enteredNumberIsValid && enteredExperienceIsValid) {
    formIsValid = true;
  }

  const formSubmissionHandler = async (event) => {
    event.preventDefault();
    nameBlurHandler();
    numberBlurHandler();
    experienceBlurHandler();
    // if (!formIsValid) return;

    setmodalIsShown(true);
    const player = {
      name: enteredName,
      number: enteredNumber,
      experience: enteredExperience,
    };
    const playerResponse = await postPlayer({
      url: "http://localhost:8080/player",
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: player,
    });
  };

  const hideModalHandler = () => {
    if (isLoading) return;

    setmodalIsShown(false);
    if (!error) {
      resetNumberInput();
      resetNameInput();
      resetExperienceInput();
      props.onRanking();
    }
  };

  return (
    <section ref={ref} className={`${classes.cta} container`}>
      <Card>
        <div>
          <Heading type="h2" className="margin-bottom-lg">
            Entre no Ranking
          </Heading>
        </div>
        <div>
          <form onSubmit={formSubmissionHandler}>
            <div className="margin-bottom-md relative">
              <label htmlFor="name">Atleta</label>
              <input
                name="name"
                id="name"
                type="text"
                placeholder="Digite seu nome completo"
                value={enteredName}
                onChange={nameChangedHandler}
                onBlur={nameBlurHandler}
                className={nameInputHasError ? classes.error : ""}
              />
              {nameInputHasError && (
                <p className={classes["error-text"]}>
                  Por favor, preencha seu nome
                </p>
              )}
            </div>
            <div className="margin-bottom-md">
              <label htmlFor="number">Celular</label>
              <input
                name="number"
                id="number"
                type="tel"
                placeholder="(95) 99999-9999"
                value={enteredNumber}
                onChange={numberChangedHandler}
                onBlur={numberBlurHandler}
                className={numberInputHasError ? classes.error : ""}
              />
              {numberInputHasError && (
                <p className={classes["error-text"]}>
                  Por favor, utilize um número de celular válido
                </p>
              )}
            </div>
            <div className="margin-bottom-md">
              <label htmlFor="experience">
                Qual a sua experiência no tênis?
              </label>
              <select
                name="experience"
                id="experience"
                value={enteredExperience}
                onChange={experienceChangedHandler}
                onBlur={experienceBlurHandler}
                className={experienceInputHasError ? classes.error : ""}
              >
                <option value="">Selecione uma das opções:</option>
                <option value="Nunca joguei">Nunca joguei</option>
                <option value="Menos de 1 ano">Menos de 1 ano</option>
                <option value="Entre 1 e 2 anos">Entre 1 e 2 anos</option>
                <option value="Entre 2 e 3 anos">Entre 2 e 3 anos</option>
                <option value="Mais de 3 anos">Mais de 3 anos</option>
              </select>
              {experienceInputHasError && (
                <p className={classes["error-text"]}>
                  Por favor, selecione a sua experiência
                </p>
              )}
            </div>
            <Button
              type="BTN"
              fill="full"
              size="20px"
              className="margin-top-sm"
            >
              Inscreva-se
            </Button>
          </form>
        </div>
      </Card>
      {modalIsShown && (
        <CallToActionModal
          onClose={hideModalHandler}
          error={error}
          errorStatusCode={errorStatusCode}
          isLoading={isLoading}
        />
      )}
    </section>
  );
});

export default CallToAction;
