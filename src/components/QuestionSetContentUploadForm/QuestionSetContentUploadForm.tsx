import React from 'react';
import { Formik } from 'formik';
import FormikInput from '@/shared-resources/FormikInput/FormikInput';
import { QuestionSet } from '@/models/entities/QuestionSet';
import MediaUpload from '@/shared-resources/MediaUpload/MediaUpload';
import * as yup from 'yup';
import { resetMediaUploadStateAction } from '@/store/actions/media.actions';
import { useDispatch } from 'react-redux';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';

type QuestionSetContentUploadFormPropsContentUploadFormProps = {
  open: boolean;
  onClose: () => void;
  questionSet: QuestionSet;
};

const QuestionSetContentUploadForm = ({
  open,
  onClose,
  questionSet,
}: QuestionSetContentUploadFormPropsContentUploadFormProps) => {
  const dispatch = useDispatch();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-[50%] max-h-[95%] overflow-y-auto'>
        <DialogHeader>Content Upload Form</DialogHeader>
        <Formik
          initialValues={{
            name: '',
            description: '',
            files: [],
            mediaObjects: [],
          }}
          validationSchema={yup.object().shape({
            name: yup.string().required('Name is required'),
            description: yup.string().required('Description is required'),
            mediaObjects: yup.array().min(1).required(),
          })}
          onSubmit={(values) => {
            console.log('##', values, questionSet);
            dispatch(resetMediaUploadStateAction());
          }}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              <FormikInput name='name' label='Name' required />
              <FormikInput name='description' label='Description' required />
              <MediaUpload
                onUploadComplete={(data) =>
                  formik.setFieldValue('mediaObjects', data)
                }
                multiple
                value={formik.values.files}
                setValue={(files) => formik.setFieldValue('files', files)}
                category='content'
              />
              <Button type='submit' disabled={!formik.isValid}>
                Submit
              </Button>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionSetContentUploadForm;
