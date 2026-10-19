import { defineTutorial } from '@/content/schema';
import coverEn from './cover-en.png';
import coverRu from './cover-ru.png';
import step1 from './step-1.png';
import step2 from './step-2.png';
import step3 from './step-3.png';
import step4 from './step-4.png';

export default defineTutorial({
  category: 'itrucking-pro',
  order: 6,
  title: {
    ru: 'Как привязывать созданных пользователей к конкретным картам и назначать им названия?',
    en: 'How to Assign Created Users to Specific Cards and Name Them?',
  },
  description: {
    ru: 'Следуйте этой простой инструкции, чтобы привязать пользователя/юзера к конкретной карте.',
    en: 'Follow this simple guide to assign a user to a specific card.',
  },
  cover: {
    ru: coverRu,
    en: coverEn,
  },
  readTime: 2,
  body: [
    {
      type: 'steps',
      items: [
        {
          title: {
            ru: 'Войдите в систему',
            en: 'Log In to the System',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Войдите в систему на портале **iTrucking Pro** по ссылке: [itrucking.pro](https://itrucking.pro/). Нажмите кнопку "Log in to Portal" и введите свой логин и пароль, которые были высланы вам на email при регистрации профиля',
                en: 'Log in to the **iTrucking Pro** Portal at: [itrucking.pro](https://itrucking.pro/). Click the "Log in to Portal" button and enter your login and password that were sent to your email when your profile was registered',
              },
            },
            {
              type: 'image',
              src: step1,
            },
            {
              type: 'callout',
              variant: 'hint',
              text: {
                ru: 'Письмо с логином и паролем было выслано вам с адреса **fuel@itrucking.pro**',
                en: 'The email with your login and password was sent from **fuel@itrucking.pro**',
              },
            },
          ],
        },
        {
          title: {
            ru: 'Перейдите в раздел Fuel Cards',
            en: 'Go to Fuel Cards Section',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'На главной странице "Dashboard" вашего аккаунта перейдите в раздел "Fuel Cards".',
                en: 'On your account Dashboard page, go to the "Fuel Cards" section.',
              },
            },
            {
              type: 'image',
              src: step2,
            },
          ],
        },
        {
          title: {
            ru: 'Откройте настройки необходимой карты',
            en: 'Open Card Details',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В появившемся окне напротив необходимой карты нажмите на иконку "view"',
                en: 'In the window that appears, click the "view" icon next to the desired card',
              },
            },
            {
              type: 'image',
              src: step3,
            },
          ],
        },
        {
          title: {
            ru: 'Привяжите пользователя и назначьте имя карте',
            en: 'Assign User and Set Card Name',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В первом пункте "Assign to Driver" выберите пользователя, которому передали данную карту, и во втором пункте "Set a Card Nickname" установите имя карты. Например: "TR 01 Company Name". После этого нажмите кнопку "сохранить".',
                en: 'In the first field "Assign to Driver" select the user who was given this card, and in the second field "Set a Card Nickname" set the card name. For example: "TR 01 Company Name". Then click the "save" button.',
              },
            },
            {
              type: 'image',
              src: step4,
            },
            {
              type: 'callout',
              variant: 'hint',
              text: {
                ru: 'Пользователь сможет видеть свои транзакции по данной карте через приложение iTrucking Pro',
                en: 'The user will be able to see their transactions for this card through the iTrucking Pro app',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'conclusion',
      text: {
        ru: 'Готово! Вы успешно привязали карту к пользователю в вашем аккаунте iTrucking Pro.',
        en: 'Done! You have successfully assigned the card to a user in your iTrucking Pro account.',
      },
    },
  ],
});
