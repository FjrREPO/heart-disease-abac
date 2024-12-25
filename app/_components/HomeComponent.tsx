"use client";

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Loader2, Heart, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const FORM_LABELS = {
  age: "Age",
  sex: "Sex",
  cp: "Chest Pain Type",
  trestbps: "Resting Blood Pressure",
  chol: "Cholesterol",
  fbs: "Fasting Blood Sugar",
  restecg: "Resting ECG",
  thalach: "Max Heart Rate",
  exang: "Exercise Induced Angina",
  oldpeak: "ST Depression",
  slope: "ST Slope",
  ca: "Number of Major Vessels",
  thal: "Thalassemia"
};

const SELECT_OPTIONS = {
  sex: [
    { value: "0", label: "Female" },
    { value: "1", label: "Male" }
  ],
  cp: [
    { value: "0", label: "Typical Angina" },
    { value: "1", label: "Atypical Angina" },
    { value: "2", label: "Non-anginal Pain" },
    { value: "3", label: "Asymptomatic" }
  ],
  fbs: [
    { value: "0", label: "≤ 120 mg/dl" },
    { value: "1", label: "> 120 mg/dl" }
  ],
  restecg: [
    { value: "0", label: "Normal" },
    { value: "1", label: "ST-T Wave Abnormality" },
    { value: "2", label: "Left Ventricular Hypertrophy" }
  ],
  exang: [
    { value: "0", label: "No" },
    { value: "1", label: "Yes" }
  ],
  oldpeak: [
    { value: "0", label: "0" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" }
  ],
  slope: [
    { value: "0", label: "Upsloping" },
    { value: "1", label: "Flat" },
    { value: "2", label: "Downsloping" }
  ],
  ca: [
    { value: "0", label: "0" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" }
  ],
  thal: [
    { value: "0", label: "Normal" },
    { value: "1", label: "Fixed Defect" },
    { value: "2", label: "Reversible Defect" },
    { value: "3", label: "Unknown" }
  ]
};

const formSchema = z.object({
  age: z.string().transform(Number).pipe(z.number().min(18).max(100)),
  sex: z.string().transform(Number).pipe(z.number().min(0).max(1)),
  cp: z.string().transform(Number).pipe(z.number().min(0).max(3)),
  trestbps: z.string().transform(Number).pipe(z.number().min(90).max(200)),
  chol: z.string().transform(Number).pipe(z.number().min(120).max(570)),
  fbs: z.string().transform(Number).pipe(z.number().min(0).max(1)),
  restecg: z.string().transform(Number).pipe(z.number().min(0).max(2)),
  thalach: z.string().transform(Number).pipe(z.number().min(60).max(220)),
  exang: z.string().transform(Number).pipe(z.number().min(0).max(1)),
  oldpeak: z.string().transform(Number).pipe(z.number().min(0).max(5)),
  slope: z.string().transform(Number).pipe(z.number().min(0).max(2)),
  ca: z.string().transform(Number).pipe(z.number().min(0).max(3)),
  thal: z.string().transform(Number).pipe(z.number().min(0).max(3))
});

type FormValues = z.infer<typeof formSchema>;

const HeartDiseasePredictor = () => {
  interface PredictionResult {
    prediction: number;
    probability: {
      positive: number;
      negative: number;
    };
  }
  
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: Object.keys(FORM_LABELS).reduce((acc, key) => ({
      ...acc,
      [key]: '',
    }), {}) as FormValues,
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to get prediction');
      }

      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    form.reset();
    setResult(null);
    setError(null);
  };

  const renderFormField = (name: keyof FormValues) => {
    const options = SELECT_OPTIONS[name as keyof typeof SELECT_OPTIONS];

    if (options) {
      return (
        <FormField
          key={name}
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{FORM_LABELS[name]}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${FORM_LABELS[name].toLowerCase()}`} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    return (
      <FormField
        key={name}
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{FORM_LABELS[name]}</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                className="w-full"
                placeholder={`Enter ${FORM_LABELS[name].toLowerCase()}`}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <div className="container mx-auto px-4 max-w-4xl my-10">
      <Card className="shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold">Heart Disease Risk Predictor</CardTitle>
              <CardDescription>
                Enter patient medical data to assess heart disease risk
              </CardDescription>
            </div>
            <Heart className={cn(
              "h-8 w-8 transition-colors duration-200",
              result?.prediction === 1 ? "text-red-500" :
                result?.prediction === 0 ? "text-green-500" :
                  "text-gray-400"
            )} />
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(FORM_LABELS).map((name) => renderFormField(name as keyof FormValues))}
              </div>
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    'Predict Risk'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset Form
                </Button>
              </div>
            </form>
          </Form>

          {(error || result) && <Separator className="my-6" />}

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="space-y-4">
              <Alert className={cn(
                "border-l-4",
                result.prediction === 1 ? "border-l-red-500 bg-red-50" : "border-l-green-500 bg-green-50"
              )}>
                <AlertTitle className="text-lg font-semibold">
                  {result.prediction === 1 ? 'High Risk Detected' : 'Low Risk Detected'}
                </AlertTitle>
                <AlertDescription className="mt-2">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Risk Level:</span>
                      <span className={cn(
                        "font-medium",
                        result.prediction === 1 ? "text-red-700" : "text-green-700"
                      )}>
                        {(result.probability.positive * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={cn(
                          "h-2.5 rounded-full",
                          result.prediction === 1 ? "bg-red-500" : "bg-green-500"
                        )}
                        style={{ width: `${result.probability.positive * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-gray-50 text-sm text-gray-500">
          This tool is for informational purposes only. Always consult with healthcare professionals for medical advice.
        </CardFooter>
      </Card>
    </div>
  );
};

export default HeartDiseasePredictor;