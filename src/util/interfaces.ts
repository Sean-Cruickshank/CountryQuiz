export interface Country {
  id: number,
  name: string,
  population: number,
  area: number
}

export interface AnswersLog {
  type: string,
  size: string,
  prevGuessName: string,
  prevGuessValue: number,
  prevAnswerName: string,
  prevAnswerValue: number
}

export interface AnswerStats {
  highpopulation: {Q: number, A: number},
  lowpopulation:  {Q: number, A: number},
  higharea:  {Q: number, A: number},
  lowarea:  {Q: number, A: number},
}

export interface RecapParameters {
  category: string[],
  currentTheme: string,
  prevGuess?: Country,
  prevAnswer?: Country,
  prevAnswers?: Country[],
  answersLog: AnswersLog[],
  setAnswersLog: React.Dispatch<React.SetStateAction<AnswersLog[]>>
}