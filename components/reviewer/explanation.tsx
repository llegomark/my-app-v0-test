// components/reviewer/explanation.tsx
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExplanationProps } from '@/types/component-types';

export default function Explanation({
    explanation,
    correctOption,
    selectedOption,
    timedOut
}: ExplanationProps): React.ReactElement {
    // Determine if the answer was correct
    const isCorrect = selectedOption === correctOption;

    return (
        <div className="mt-6">
            <Alert
                variant={isCorrect ? "default" : "destructive"}
                className={isCorrect ? "border-green-500 bg-green-50" : ""}
            >
                <AlertTitle className={isCorrect ? "text-green-700" : ""}>
                    {timedOut ? (
                        "Time's Up!"
                    ) : isCorrect ? (
                        "Correct Answer!"
                    ) : (
                        "Incorrect Answer"
                    )}
                </AlertTitle>
                <AlertDescription>
                    {timedOut ? (
                        <div>
                            <p className="font-medium mb-2">You ran out of time. The correct answer is Option {correctOption}.</p>
                            {explanation && <p className="mt-2">{explanation}</p>}
                        </div>
                    ) : isCorrect ? (
                        <div>
                            <p className="text-green-700">You selected the correct answer: Option {correctOption}.</p>
                            {explanation && <p className="mt-2">{explanation}</p>}
                        </div>
                    ) : (
                        <div>
                            <p className="font-medium mb-2">
                                You selected Option {selectedOption}. The correct answer is Option {correctOption}.
                            </p>
                            {explanation && <p className="mt-2">{explanation}</p>}
                        </div>
                    )}
                </AlertDescription>
            </Alert>
        </div>
    );
}