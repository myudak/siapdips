import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Eye, Star, Download } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ResumeTemplate, resumeTemplates } from "./resume-data";
import ResumeDialog from "./ResumeDialog";

const ResumeCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedResume, setSelectedResume] = useState<ResumeTemplate | null>(
    null
  );

  const itemsPerView = 3;
  const maxIndex = Math.max(0, resumeTemplates.length - itemsPerView);

  const handlePrevious = () => {
    setCurrentIndex(currentIndex === 0 ? maxIndex : currentIndex - 1);
  };

  const handleNext = () => {
    setCurrentIndex(currentIndex === maxIndex ? 0 : currentIndex + 1);
  };

  const visibleResumes = resumeTemplates.slice(
    currentIndex,
    currentIndex + itemsPerView
  );

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-4">Resume Examples</h2>
        {/* <p className="text-muted-foreground text-center">
          Discover professional resume templates that help you stand out
        </p> */}
      </div>

      <div className="relative">
        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
        >
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
        >
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg"
            onClick={handleNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </motion.div>

        {/* Carousel Content */}
        <div className="mx-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {visibleResumes.map((resume, index) => (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                  }}
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.15 },
                  }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
                    <CardHeader className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <motion.img
                          src={resume.imageUrl}
                          alt={resume.title}
                          className="w-full h-64 object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.4 }}
                        />
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Dialog>
                            <DialogTrigger asChild>
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="gap-2 shadow-lg backdrop-blur-sm"
                                  onClick={() => setSelectedResume(resume)}
                                >
                                  <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      repeatDelay: 3,
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </motion.div>
                                  View Details
                                </Button>
                              </motion.div>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              {selectedResume && (
                                <ResumeDialog selectedResume={selectedResume} />
                              )}
                            </DialogContent>
                          </Dialog>
                        </motion.div>
                      </div>
                    </CardHeader>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <CardContent className="p-4">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 }}
                        >
                          <CardTitle className="text-lg mb-2">
                            {resume.title}
                          </CardTitle>
                          <CardDescription className="text-sm mb-3">
                            {resume.description}
                          </CardDescription>
                        </motion.div>

                        {/* <motion.div
                          className="flex items-center justify-between"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.4 }}
                        >
                          <div className="flex items-center gap-1">
                            <motion.div
                              whileHover={{ rotate: 180 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            </motion.div>
                            <span className="text-sm font-medium">
                              {resume.rating}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {resume.downloads} downloads
                          </span>
                        </motion.div> */}

                        {resume.category &&
                          (resume.category.length > 0 ? (
                            <motion.div
                              className="mt-3 flex gap-4"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.5 }}
                            >
                              {resume.category.map((cat) => (
                                <motion.span
                                  className="inline-block px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
                                  whileHover={{ scale: 1.05 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {cat}
                                </motion.span>
                              ))}
                            </motion.div>
                          ) : null)}
                      </CardContent>
                    </motion.div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots Indicator */}
        <motion.div
          className="flex justify-center mt-6 gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-primary"
                  : "bg-secondary dark:bg-muted"
              }`}
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                scale: index === currentIndex ? 1.2 : 1,
              }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </motion.div>
      </div>

      {/* shadcn button create */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="default"
            className="px-6 py-3 text-lg font-semibold shadow-lg"
            asChild
          >
            <a
              href="https://www.overleaf.com/latex/templates/jakes-resume/syzfjbzwjncs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Create Your Own Resume / CV
            </a>
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ResumeCarousel;
