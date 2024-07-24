import React, { FC, useState, useEffect, SyntheticEvent } from 'react';
import { Button } from '@headlessui/react';

import type {
  MirrorablePublication,
  MomokaCommentRequest,
  MomokaPostRequest,
  MomokaQuoteRequest,
  OnchainCommentRequest,
  OnchainPostRequest,
  OnchainQuoteRequest,
  Quote
} from '@good/lens';

import getAvatar from '@good/helpers/getAvatar';
import { Image } from '@good/ui';
import { defineEditorExtension } from '@helpers/prosekit/extension';
import { htmlFromMarkdown } from '@helpers/prosekit/markdown';
import dynamic from 'next/dynamic';
import 'prosekit/basic/style.css';
import { createEditor } from 'prosekit/core';
import { ProseKit } from 'prosekit/react';
import { useMemo, useRef } from 'react';
import useContentChange from 'src/hooks/prosekit/useContentChange';
import { usePaste } from 'src/hooks/prosekit/usePaste';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import { useEditorHandle } from '@components/Composer/Editor/EditorHandle';
import Discard from '@components/Composer/Post/Discard';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import Attachment from '@components/Composer/Actions/Attachment';
import useCreatePublication from 'src/hooks/useCreatePublication';
import errorToast from '@helpers/errorToast';
import { usePublicationAudioStore } from 'src/store/non-persisted/publication/usePublicationAudioStore';

import type { IGif } from '@good/types/giphy';
import type { NewAttachment } from '@good/types/misc';

import NewAttachments from '@components/Composer/NewAttachments';
import QuotedPublication from '@components/Publication/QuotedPublication';
import { AudioPublicationSchema } from '@components/Shared/Audio';
import Wrapper from '@components/Shared/Embed/Wrapper';
import { KNOWN_ATTRIBUTES } from '@good/data/constants';
import { Errors } from '@good/data/errors';
import { PUBLICATION } from '@good/data/tracking';
import checkDispatcherPermissions from '@good/helpers/checkDispatcherPermissions';
import collectModuleParams from '@good/helpers/collectModuleParams';
import getMentions from '@good/helpers/getMentions';
import getProfile from '@good/helpers/getProfile';
import removeQuoteOn from '@good/helpers/removeQuoteOn';
import { ReferenceModuleType } from '@good/lens';
import { Card, ErrorMessage } from '@good/ui';
import cn from '@good/ui/cn';
import { Leafwatch } from '@helpers/leafwatch';
import uploadToArweave from '@helpers/uploadToArweave';
import { MetadataAttributeType } from '@lens-protocol/metadata';
import { useUnmountEffect } from 'framer-motion';
import toast from 'react-hot-toast';
import useCreatePoll from 'src/hooks/useCreatePoll';
import usePublicationMetadata from 'src/hooks/usePublicationMetadata';
import { useCollectModuleStore } from 'src/store/non-persisted/publication/useCollectModuleStore';
import { useOpenActionStore } from 'src/store/non-persisted/publication/useOpenActionStore';
import { usePublicationAttachmentStore } from 'src/store/non-persisted/publication/usePublicationAttachmentStore';
import { usePublicationAttributesStore } from 'src/store/non-persisted/publication/usePublicationAttributesStore';
import {
  DEFAULT_AUDIO_PUBLICATION,
} from 'src/store/non-persisted/publication/usePublicationAudioStore';
import { usePublicationLicenseStore } from 'src/store/non-persisted/publication/usePublicationLicenseStore';
import { usePublicationLiveStore } from 'src/store/non-persisted/publication/usePublicationLiveStore';
import { usePublicationPollStore } from 'src/store/non-persisted/publication/usePublicationPollStore';
import { usePublicationRequestStore } from 'src/store/non-persisted/publication/usePublicationRequestStore';
import {
  DEFAULT_VIDEO_THUMBNAIL,
  usePublicationVideoStore
} from 'src/store/non-persisted/publication/usePublicationVideoStore';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import { useProfileStatus } from 'src/store/non-persisted/useProfileStatus';
import { useProStore } from 'src/store/non-persisted/useProStore';
import { useReferenceModuleStore } from 'src/store/non-persisted/useReferenceModuleStore';

import LivestreamEditor from '@components/Composer/Actions/LivestreamSettings/LivestreamEditor';
import PollEditor from '@components/Composer/Actions/PollSettings/PollEditor';
import RequestEditor from '@components/Composer/Actions/RequestSettings/RequestEditor';
import { Editor,useEditorContext, withEditorContext } from '@components/Composer/Editor';
import LinkPreviews from '@components/Composer/LinkPreviews';
import OpenActionsPreviews from '@components/Composer/OpenActionsPreviews';



















// Lazy load EditorMenus to reduce bundle size
const EditorMenus = dynamic(() => import('@components/Composer/Editor/EditorMenus'), { ssr: false });


interface VolunteerPublicationProps {
  publication?: MirrorablePublication;
}

const VolunteerEditor: FC<VolunteerPublicationProps> = ({ publication }) => {
  const { currentProfile } = useProfileStore();
  const content = '';
  const defaultMarkdownRef = useRef(content);
  const { setShowDiscardModal, setShowNewPostModal } =
  useGlobalModalStateStore();
  const [publicationContentError, setPublicationContentError] = useState('');
  const { audioPublication, setAudioPublication } = usePublicationAudioStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [nftOpenActionEmbed, setNftOpenActionEmbed] = useState();
  const [exceededMentionsLimit, setExceededMentionsLimit] = useState(false);
  const { addAttachments, attachments, isUploading, setAttachments } =
    usePublicationAttachmentStore((state) => state);
    const { isSuspended } = useProfileStatus();
    const { pollConfig, resetPollConfig, setShowPollEditor, showPollEditor } =
    usePublicationPollStore();
    const { degreesOfSeparation, onlyFollowers, selectedReferenceModule } =
    useReferenceModuleStore();
    const { lensHubOnchainSigNonce } = useNonceStore();




  // Collect module store
  const { collectModule, reset: resetCollectSettings } = useCollectModuleStore(
    (state) => state
  );

  // Open action store
  const { openAction, reset: resetOpenActionSettings } = useOpenActionStore();




  const defaultHTML = useMemo(() => {
    const markdown = defaultMarkdownRef.current;
    return markdown ? htmlFromMarkdown(markdown) : undefined;
  }, []);

  const [formData, setFormData] = useState({
    opportunityName: '',
    startDate: '',
    endDate: '',
    expectedHours: '',
    category: '',
    website: '',
    desc: '',
    imageFile: null, 
  });

   const {
    publicationContent,
    quotedPublication,
    setPublicationContent,
    setQuotedPublication,
    setTags
  } = usePublicationStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const createPoll = useCreatePoll();
  const getMetadata = usePublicationMetadata();

  const { canUseLensManager } = checkDispatcherPermissions(currentProfile);


  const editor = useMemo(() => {
    const extension = defineEditorExtension();
    return createEditor({ defaultHTML, extension });
  }, [defaultHTML]);

  useContentChange(editor);
  usePaste(editor);
  useEditorHandle(editor);

  const { opportunityName, startDate, endDate, expectedHours, category, website, desc } = formData;

  const onError = (error?: any) => {
    errorToast(error);
  };

  const onCompleted = (
    __typename?:
      | 'CreateMomokaPublicationResult'
      | 'LensProfileManagerRelayError'
      | 'RelayError'
      | 'RelaySuccess'
  ) => {
    if (
      __typename === 'RelayError' ||
      __typename === 'LensProfileManagerRelayError'
    ) {
      return  onError;

    }

  };


  const {
    createCommentOnChain,
    createCommentOnMomka,
    createMomokaCommentTypedData,
    createMomokaPostTypedData,
    createMomokaQuoteTypedData,
    createOnchainCommentTypedData,
    createOnchainPostTypedData,
    createOnchainQuoteTypedData,
    createPostOnChain,
    createPostOnMomka,
    createQuoteOnChain,
    createQuoteOnMomka,
    error
  } = useCreatePublication({
    commentOn: publication,
    onCompleted,
    onError,
    quoteOn: quotedPublication as Quote
  });

  useEffect(() => {
    setPublicationContentError('');
  }, [audioPublication]);

  useEffect(() => {
    if (getMentions(publicationContent).length > 50) {
      setExceededMentionsLimit(true);
      setPublicationContentError('You can only mention 50 people at a time!');
    } else {
      setExceededMentionsLimit(false);
      setPublicationContentError('');
    }
  }, [publicationContent]);


  const isComment = Boolean(publication);
  const isQuote = Boolean(quotedPublication);
  const hasAudio = attachments[0]?.type === 'Audio';
  const hasVideo = attachments[0]?.type === 'Video';

  const noCollect = !collectModule.type;
  const noOpenAction = !openAction;
  // Use Momoka if the profile the comment or quote has momoka proof and also check collect module has been disabled
  const useMomoka = isComment
    ? publication?.momoka?.proof
    : isQuote
      ? quotedPublication?.momoka?.proof
      : noCollect && noOpenAction;


  const getAnimationUrl = () => {
    const fallback =
      'ipfs://bafkreiaoua5s4iyg4gkfjzl6mzgenw4qw7mwgxj7zf7ev7gga72o5d3lf4';

    if (attachments.length > 0 || hasAudio || hasVideo) {
      return attachments[0]?.uri || fallback;
    }

    return fallback;
  };

  const getTitlePrefix = () => {
    if (hasVideo) {
      return 'Video';
    }

    return isComment ? 'Comment' : isQuote ? 'Quote' : 'Post';
  };



  const createPublication = async () => {
    const combinedData = `
    ${opportunityName}
    ${startDate}
    ${endDate}
    ${expectedHours}
    ${category}
    ${website}
    ${desc}
  `;

    console.log(combinedData);
    setPublicationContent(combinedData);

    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);
      if (hasAudio) {
        setPublicationContentError('');
        const parsedData = AudioPublicationSchema.safeParse(audioPublication);
        if (!parsedData.success) {
          const issue = parsedData.error.issues[0];
          setIsLoading(false);
          return setPublicationContentError(issue.message);
        }
      }

      if (publicationContent.length === 0 && attachments.length === 0) {
        setIsLoading(false);
        return setPublicationContentError(
          `${
            isComment ? 'Comment' : isQuote ? 'Quote' : 'Post'
          } should not be empty!`
        );
      }

      setPublicationContentError('');

      let pollId;
      if (showPollEditor) {
        pollId = await createPoll();
      }

      const processedPublicationContent =
        publicationContent.length > 0 ? publicationContent : undefined;
      const title = hasAudio
        ? audioPublication.title
        : `${getTitlePrefix()} by ${getProfile(currentProfile).slugWithPrefix}`;
      const hasAttributes = Boolean(pollId);

      const baseMetadata = {
        content: processedPublicationContent,
        title,
        ...(hasAttributes && {
          attributes: [
            ...(pollId
              ? [
                  {
                    key: KNOWN_ATTRIBUTES.POLL_ID,
                    type: MetadataAttributeType.STRING,
                    value: pollId
                  }
                ]
              : [])
          ]
        }),
        marketplace: {
          animation_url: getAnimationUrl(),
          description: processedPublicationContent,
          external_url: `https://bcharity.net${getProfile(currentProfile).link}`,
          name: title
        }
      };

      const metadata = getMetadata({ baseMetadata });
      const arweaveId = await uploadToArweave(metadata);

      // Payload for the open action module
      const openActionModules = [];

      if (nftOpenActionEmbed) {
        openActionModules.push(nftOpenActionEmbed);
      }

      if (Boolean(collectModule.type)) {
        openActionModules.push({
          collectOpenAction: collectModuleParams(collectModule)
        });
      }

      if (Boolean(openAction)) {
        openActionModules.push({ unknownOpenAction: openAction });
      }

      // Payload for the Momoka post/comment/quote
      const momokaRequest:
        | MomokaCommentRequest
        | MomokaPostRequest
        | MomokaQuoteRequest = {
        ...(isComment && { commentOn: publication?.id }),
        ...(isQuote && { quoteOn: quotedPublication?.id }),
        contentURI: `ar://${arweaveId}`
      };

      if (useMomoka && !nftOpenActionEmbed) {
        if (canUseLensManager) {
          if (isComment) {
            return await createCommentOnMomka(
              momokaRequest as MomokaCommentRequest
            );
          }

          if (isQuote) {
            return await createQuoteOnMomka(
              momokaRequest as MomokaQuoteRequest
            );
          }

          return await createPostOnMomka(momokaRequest);
        }

        if (isComment) {
          return await createMomokaCommentTypedData({
            variables: { request: momokaRequest as MomokaCommentRequest }
          });
        }

        if (isQuote) {
          return await createMomokaQuoteTypedData({
            variables: { request: momokaRequest as MomokaQuoteRequest }
          });
        }

        return await createMomokaPostTypedData({
          variables: { request: momokaRequest }
        });
      }

      // Payload for the post/comment/quote
      const onChainRequest:
        | OnchainCommentRequest
        | OnchainPostRequest
        | OnchainQuoteRequest = {
        contentURI: `ar://${arweaveId}`,
        ...(isComment && { commentOn: publication?.id }),
        ...(isQuote && { quoteOn: quotedPublication?.id }),
        openActionModules,
        ...(onlyFollowers && {
          referenceModule:
            selectedReferenceModule ===
            ReferenceModuleType.FollowerOnlyReferenceModule
              ? { followerOnlyReferenceModule: true }
              : {
                  degreesOfSeparationReferenceModule: {
                    commentsRestricted: true,
                    degreesOfSeparation,
                    mirrorsRestricted: true,
                    quotesRestricted: true
                  }
                }
        })
      };

      if (canUseLensManager) {
        if (isComment) {
          return await createCommentOnChain(
            onChainRequest as OnchainCommentRequest
          );
        }

        if (isQuote) {
          return await createQuoteOnChain(
            onChainRequest as OnchainQuoteRequest
          );
        }

        return await createPostOnChain(onChainRequest);
      }

      if (isComment) {
        return await createOnchainCommentTypedData({
          variables: {
            options: { overrideSigNonce: lensHubOnchainSigNonce },
            request: onChainRequest as OnchainCommentRequest
          }
        });
      }

      if (isQuote) {
        return await createOnchainQuoteTypedData({
          variables: {
            options: { overrideSigNonce: lensHubOnchainSigNonce },
            request: onChainRequest as OnchainQuoteRequest
          }
        });
      }

      return await createOnchainPostTypedData({
        variables: {
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request: onChainRequest
        }
      });
    } catch (error) {
      onError(error);
    }
  };


  return (
    <ProseKit editor={editor}>
      <div className="box-border flex h-full w-full justify-stretch overflow-y-auto overflow-x-hidden px-5 py-4">
        <Image
          alt={currentProfile?.id}
          className="mr-3 size-11 rounded-full border bg-gray-200 dark:border-gray-700"
          src={getAvatar(currentProfile)}
        />
        <div className="flex flex-1 flex-col overflow-x-hidden">
          <EditorMenus />
          <div className="p-4 flex flex-col items-center justify-center w-full">
            <div className="relative w-full mb-5">
              <label className="text-xs dark:text-white text-black">Volunteer opportunity name</label>
              <input
                type="text"
                name="opportunityName"
                className="border-2 border-black rounded-full px-5 py-3 text-black w-full focus:border-pink-500"
                placeholder="Medical Internship"
                value={opportunityName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative w-full mb-5">
              <label className="text-xs dark:text-white text-black">Start Date</label>
              <input
                type="date"
                name="startDate"
                className="border-2 border-black rounded-full px-5 py-3 text-black w-full focus:border-pink-500"
                value={startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative w-full mb-5">
              <label className="text-xs dark:text-white text-black">End Date</label>
              <input
                type="date"
                name="endDate"
                className="border-2 border-black rounded-full px-5 py-3 text-black w-full focus:border-pink-500"
                value={endDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative w-full mb-5">
              <label className="text-xs dark:text-white text-black">Expected number of hours</label>
              <input
                type="number"
                name="expectedHours"
                className="border-2 border-black rounded-full px-5 py-3 text-black w-full focus:border-pink-500"
                placeholder="Ex: 5"
                value={expectedHours}
                onChange={handleChange}
                required
                min="0"
              />
            </div>

            <div className="relative w-full mb-5">
              <label className="text-xs dark:text-white text-black">Category</label>
              <input
                type="text"
                name="category"
                className="border-2 border-black rounded-full px-5 py-3 text-black w-full focus:border-pink-500"
                placeholder="Healthcare"
                value={category}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative w-full mb-5">
              <label className="text-xs dark:text-white text-black">Website (leave empty if not linking to external opportunity)</label>
              <input
                type="text"
                name="website"
                className="border-2 border-black rounded-full px-5 py-3 text-black w-full focus:border-pink-500"
                placeholder="https://ecssen.ca/"
                value={website}
                onChange={handleChange}
              />
            </div>

            <div className="relative w-full mb-5">
              <label className="text-xs dark:text-white text-black">Activity Description</label>
              <textarea
                name="desc"
                className="border-2 border-black rounded-lg px-5 py-3 text-black w-full focus:border-pink-500 h-40 resize-none"
                placeholder="Tell us more about this volunteer opportunity"
                value={desc}
                onChange={handleChange}
                required
              />
            </div>
            <div className="relative w-full mb-5">
            <Attachment/>
             
            </div>

          </div>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <Button
           onClick={createPublication}
          className="mb-5 mr-8 rounded-full px-4 py-2 text-sm text-white"
          style={{ background: '#da5597' }}
        >
          Create Opportunity
        </Button>
      </div>   
    </ProseKit>
  );
};

export default VolunteerEditor;
