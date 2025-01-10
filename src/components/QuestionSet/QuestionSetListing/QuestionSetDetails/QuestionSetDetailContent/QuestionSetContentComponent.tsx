import { Content } from '@/models/entities/Content';
import FormikInfiniteSelect from '@/shared-resources/FormikSelect/FormikInfiniteSelect';
import {
  getContentByIdAction,
  getListContentAction,
} from '@/store/actions/content.actions';
import {
  contentSelector,
  isLoadingContentSelector,
} from '@/store/selectors/content.selector';
import { createEntitySelectorFactory } from '@/store/selectors/root.selectors';
import { Formik } from 'formik';
import { Pencil } from 'lucide-react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type QuestionSetContentComponentPropsProps = {
  contentId?: string;
};

const QuestionSetContentComponent = ({
  contentId,
}: QuestionSetContentComponentPropsProps) => {
  const dispatch = useDispatch();

  const { result: contentList, totalCount: contentCount } =
    useSelector(contentSelector);
  const isLoadingContent = useSelector(isLoadingContentSelector);

  const [selectedContent, setSelectedContent] = React.useState<Content>();
  const [editContent, setEditContent] = React.useState(false);
  // const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const content = useSelector(
    createEntitySelectorFactory('content', contentId ?? '')
  ) as Content;

  useEffect(() => setSelectedContent(content), [content]);

  useEffect(() => {
    if (selectedContent?.identifier || !contentId) return;
    dispatch(getContentByIdAction(contentId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentId, selectedContent?.identifier]);

  // const handleNextClick = () => {
  //   if (currentVideoIndex < mediaURLs.length - 1) {
  //     setCurrentVideoIndex((prevIndex) => prevIndex + 1);
  //   }
  // };

  // const handleBackClick = () => {
  //   if (currentVideoIndex > 0) {
  //     setCurrentVideoIndex((prevIndex) => prevIndex - 1);
  //   }
  // };

  return (
    <Formik
      initialValues={{
        content_id: contentId,
      }}
      onSubmit={console.log}
    >
      {(formik) => (
        <form
          onSubmit={formik.handleSubmit}
          className='flex flex-col overflow-x-hidden px-1'
        >
          {!editContent ? (
            <>
              <p className='font-medium text-sm text-primary mb-1'>Content</p>
              <div className='flex items-center gap-5'>
                <p className='h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base'>
                  {selectedContent?.name?.en}
                </p>
                <Pencil
                  onClick={() => setEditContent(true)}
                  className='fill-primary w-5 text-primary cursor-pointer'
                />
              </div>
            </>
          ) : (
            <FormikInfiniteSelect
              key={selectedContent?.identifier}
              name='content_id'
              label='Content'
              placeholder='Select Content'
              data={contentList}
              labelKey='name.en'
              valueKey='identifier'
              dispatchAction={(payload) =>
                getListContentAction({
                  filters: {
                    search_query: payload.value,
                    page_no: payload.page_no,
                  },
                })
              }
              isLoading={isLoadingContent}
              totalCount={contentCount}
              preLoadedOptions={[selectedContent]}
              onValueChange={setSelectedContent}
            />
          )}
          <div className='flex flex-col gap-3'>
            <div className='flex gap-3 w-full'>
              {/* {selectedContent?.media?.map((media) => (
                  <div className=''>
                  <div className='flex items-center justify-between w-full h-full'>
                    <button
                      className='text-gray-600 hover:text-gray-800 disabled:opacity-50'
                      onClick={handleBackClick}
                      disabled={currentVideoIndex === 0}
                    >
                      <ChevronLeft fontSize='large' />
                    </button>

                    <div className='flex-1 h-full'>
                      <ReactPlayer
                        url={mediaURLs[currentVideoIndex]}
                        playing
                        controls
                        width='100%'
                        height='100%'
                        className='rounded-lg overflow-hidden'
                        onProgress={handleProgress}
                      />
                    </div>

                    <button
                      className='text-gray-600 hover:text-gray-800 disabled:opacity-50'
                      onClick={handleNextClick}
                      disabled={currentVideoIndex === mediaURLs.length - 1}
                    >
                      <ChevronRight fontSize='large' />
                    </button>
                  </div>
                </div>
                <div />
              ))} */}
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};
export default QuestionSetContentComponent;
