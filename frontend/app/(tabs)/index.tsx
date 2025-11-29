import QuizModal from '@/components/quizModal';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function Tab() {
  const [showModal, setShowModal] = React.useState(true);

  //Sliders

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        {/* Modal that opens once every 24h */}
        <QuizModal isOpen={showModal} setIsOpen={setShowModal} />

        {/* Lista najlepszych dopasowan pobranych z api */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
