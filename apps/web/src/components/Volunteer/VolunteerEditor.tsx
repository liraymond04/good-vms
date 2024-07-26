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
import type { FC } from 'react';

import Attachment from '@components/Composer/Actions/Attachment';
import { useEditorHandle } from '@components/Composer/Editor/EditorHandle';
import { AudioPublicationSchema } from '@components/Shared/Audio';
import { KNOWN_ATTRIBUTES } from '@good/data/constants';
import { Errors } from '@good/data/errors';
import checkDispatcherPermissions from '@good/helpers/checkDispatcherPermissions';
import collectModuleParams from '@good/helpers/collectModuleParams';
import getAvatar from '@good/helpers/getAvatar';
import getMentions from '@good/helpers/getMentions';
import getProfile from '@good/helpers/getProfile';
import { ReferenceModuleType } from '@good/lens';
import { Image } from '@good/ui';
import { Button } from '@headlessui/react';
import errorToast from '@helpers/errorToast';
import { defineEditorExtension } from '@helpers/prosekit/extension';
import { htmlFromMarkdown } from '@helpers/prosekit/markdown';
import uploadToArweave from '@helpers/uploadToArweave';
import { MetadataAttributeType } from '@lens-protocol/metadata';
import dynamic from 'next/dynamic';
import 'prosekit/basic/style.css';
import { createEditor } from 'prosekit/core';
import { ProseKit } from 'prosekit/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import useContentChange from 'src/hooks/prosekit/useContentChange';
import { usePaste } from 'src/hooks/prosekit/usePaste';
import useCreatePoll from 'src/hooks/useCreatePoll';
import useCreatePublication from 'src/hooks/useCreatePublication';
import usePublicationMetadata from 'src/hooks/usePublicationMetadata';
import { useCollectModuleStore } from 'src/store/non-persisted/publication/useCollectModuleStore';
import { useOpenActionStore } from 'src/store/non-persisted/publication/useOpenActionStore';
import { usePublicationAttachmentStore } from 'src/store/non-persisted/publication/usePublicationAttachmentStore';
import { usePublicationAudioStore } from 'src/store/non-persisted/publication/usePublicationAudioStore';
import { usePublicationPollStore } from 'src/store/non-persisted/publication/usePublicationPollStore';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import { useProfileStatus } from 'src/store/non-persisted/useProfileStatus';
import { useReferenceModuleStore } from 'src/store/non-persisted/useReferenceModuleStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

// Lazy load EditorMenus to reduce bundle size
const EditorMenus = dynamic(
  () => import('@components/Composer/Editor/EditorMenus'),
  { ssr: false }
);

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
    category: '',
    desc: '',
    endDate: '',
    expectedHours: '',
    imageFile: null,
    opportunityName: '',
    startDate: '',
    website: ''
  });

  const {
    publicationContent,
    quotedPublication,
    setPublicationContent,
    setQuotedPublication,
    setTags
  } = usePublicationStore();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
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

  const {
    category,
    desc,
    endDate,
    expectedHours,
    opportunityName,
    startDate,
    website
  } = formData;

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
      return onError;
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
          <div className="flex w-full flex-col items-center justify-center p-4">
            <div className="relative mb-5 w-full">
              <label className="text-xs text-black dark:text-white">
                Volunteer opportunity name
              </label>
              <input
                className="w-full rounded-full border-2 border-black px-5 py-3 text-black focus:border-pink-500"
                name="opportunityName"
                onChange={handleChange}
                placeholder="Medical Internship"
                required
                type="text"
                value={opportunityName}
              />
            </div>

            <div className="relative mb-5 w-full">
              <label className="text-xs text-black dark:text-white">
                Start Date
              </label>
              <input
                className="w-full rounded-full border-2 border-black px-5 py-3 text-black focus:border-pink-500"
                name="startDate"
                onChange={handleChange}
                required
                type="date"
                value={startDate}
              />
            </div>

            <div className="relative mb-5 w-full">
              <label className="text-xs text-black dark:text-white">
                End Date
              </label>
              <input
                className="w-full rounded-full border-2 border-black px-5 py-3 text-black focus:border-pink-500"
                name="endDate"
                onChange={handleChange}
                required
                type="date"
                value={endDate}
              />
            </div>

            <div className="relative mb-5 w-full">
              <label className="text-xs text-black dark:text-white">
                Expected number of hours
              </label>
              <input
                className="w-full rounded-full border-2 border-black px-5 py-3 text-black focus:border-pink-500"
                min="0"
                name="expectedHours"
                onChange={handleChange}
                placeholder="Ex: 5"
                required
                type="number"
                value={expectedHours}
              />
            </div>

            <div className="relative mb-5 w-full">
              <label className="text-xs text-black dark:text-white">
                Category
              </label>
              <input
                className="w-full rounded-full border-2 border-black px-5 py-3 text-black focus:border-pink-500"
                name="category"
                onChange={handleChange}
                placeholder="Healthcare"
                required
                type="text"
                value={category}
              />
            </div>

            <div className="relative mb-5 w-full">
              <label className="text-xs text-black dark:text-white">
                Website (leave empty if not linking to external opportunity)
              </label>
              <input
                className="w-full rounded-full border-2 border-black px-5 py-3 text-black focus:border-pink-500"
                name="website"
                onChange={handleChange}
                placeholder="https://ecssen.ca/"
                type="text"
                value={website}
              />
            </div>

            <div className="relative mb-5 w-full">
              <label className="text-xs text-black dark:text-white">
                Activity Description
              </label>
              <textarea
                className="h-40 w-full resize-none rounded-lg border-2 border-black px-5 py-3 text-black focus:border-pink-500"
                name="desc"
                onChange={handleChange}
                placeholder="Tell us more about this volunteer opportunity"
                required
                value={desc}
              />
            </div>
            <div className="relative mb-5 w-full">
              <Attachment />
            </div>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <Button
          className="mb-5 mr-8 rounded-full px-4 py-2 text-sm text-white"
          onClick={createPublication}
          style={{ background: '#da5597' }}
        >
          Create Opportunity
        </Button>
      </div>
    </ProseKit>
  );
};

export default VolunteerEditor;
