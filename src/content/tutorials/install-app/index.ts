import { defineTutorial } from '@/content/schema';
import coverEn from './cover-en.png';
import coverRu from './cover-ru.png';
import step2 from './step-2.png';
import step3 from './step-3.png';

export default defineTutorial({
  category: 'itrucking-pro',
  order: 2,
  title: {
    ru: 'Как скачать и установить приложение iTrucking Pro?',
    en: 'How to Download and Install iTrucking Pro App?',
  },
  description: {
    ru: 'Для поиска лучших цен на топливо скачивайте и устанавливайте наше приложение iTrucking Pro',
    en: 'To find the best fuel prices, download and install our iTrucking Pro app',
  },
  cover: {
    ru: coverRu,
    en: coverEn,
  },
  readTime: 1,
  body: [
    {
      type: 'steps',
      items: [
        {
          title: {
            ru: 'Скачайте приложение',
            en: 'Download the App',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Скачайте и установите приложение iTrucking Pro на ваше устройство',
                en: 'Download and install the iTrucking Pro app on your device',
              },
            },
            {
              type: 'appDownload',
            },
          ],
        },
        {
          title: {
            ru: 'Войдите в приложение',
            en: 'Log In to the App',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Войдите в приложение под своим логином и паролем.',
                en: 'Log in to the app with your username and password.',
              },
            },
            {
              type: 'image',
              src: step2,
            },
            {
              type: 'callout',
              variant: 'hint',
              text: {
                ru: 'Письмо с логином и паролем было выслано вам с адреса **fuel@itrucking.pro**',
                en: 'The email with your login and password was sent from **fuel@itrucking.pro**',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Найдите в вашей электронной почте самый первый email от компании "iTrucking Pro", в нем будут ваши логин и пароль.',
                en: 'Find the first email from "iTrucking Pro" in your inbox—it contains your username and password.',
              },
            },
          ],
        },
        {
          title: {
            ru: 'Предоставьте доступ к геолокации',
            en: 'Allow Location Access',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Предоставьте доступ к геолокации. Это необходимо для просмотра цен на топливо на вашей карте.',
                en: 'Grant location access. This is necessary to view fuel prices on your map.',
              },
            },
            {
              type: 'image',
              src: step3,
            },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'conclusion',
      text: {
        ru: 'Готово! Теперь вам доступны цены на топливо на всех трак стопах США, доступных в нашей сети.',
        en: 'Done! Now you have access to fuel prices at all US truck stops available in our network.',
      },
    },
  ],
});
